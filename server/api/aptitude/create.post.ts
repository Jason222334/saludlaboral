import prisma from '../../utils/prisma'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import QRCode from 'qrcode' // <--- NUEVA IMPORTACIÓN

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    // --- BUSCAR MÉDICO Y GUARDAR EN BD (Igual que antes) ---
    const medico = await prisma.usuario.findFirst({
        where: { username: 'admin' } 
    }) || await prisma.usuario.findFirst();

    if (!medico) {
        throw createError({ statusCode: 500, statusMessage: 'No hay usuarios (médicos) en el sistema para firmar.' })
    }

    const paciente = await prisma.paciente.findFirst({
        where: { email: body.patientEmail },
        include: { admisiones: { orderBy: { created_at: 'desc' }, take: 1 } }
    })

    if (paciente && paciente.admisiones[0]) {
        await prisma.conceptoAptitud.create({
            data: {
                admision_id: paciente.admisiones[0].id,
                medico_id: medico.id,
                concepto: body.concepto,
                observaciones: body.observaciones,
                fecha_emision: new Date(),
                estado: 'Emitido'
            }
        })
    }
    // -----------------------------------------------------

    // 2. GENERAR EL PDF CON QR
    const fileName = `informe-${Date.now()}.pdf`
    const dir = path.join(process.cwd(), 'public', 'reports')
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, fileName)
    
    // --> GENERAR EL QR EN MEMORIA (BUFFER)
    // El contenido es texto simple, no funcional, como pediste.
    const qrContent = `VALIDACION-DIGITAL-${Date.now()}-${body.patientName}`
    const qrBuffer = await QRCode.toBuffer(qrContent)

    // Crear el documento PDF
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(filePath))

    // --> INSERTAR EL QR (Esquina superior derecha)
    // Coordenadas: x=450, y=50, ancho=80px
    doc.image(qrBuffer, 450, 50, { width: 80 })

    // Contenido del PDF (Texto)
    doc.fontSize(20).text('CERTIFICADO DE APTITUD MÉDICO OCUPACIONAL', { align: 'center', width: 400 }) // Ajustamos width para no chocar con el QR
    doc.moveDown()
    
    doc.fontSize(12).text(`Paciente: ${body.patientName}`)
    doc.text(`Email: ${body.patientEmail}`)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`)
    doc.moveDown()
    
    doc.fontSize(16).text(`RESULTADO: ${body.concepto}`, { align: 'center', underline: true })
    doc.moveDown()
    
    doc.fontSize(12).text('Observaciones:')
    doc.text(body.observaciones || 'Ninguna')
    doc.moveDown(4)
    
    doc.text('_________________________', { align: 'center' })
    doc.text(`Dr. ${medico.nombre} ${medico.apellido}`, { align: 'center' })
    doc.fontSize(10).text('CMP: 123456', { align: 'center' }) // Mock CMP
    
    doc.end()

    // URL pública
    const publicUrl = `http://localhost:3000/reports/${fileName}`

    // 3. Disparar n8n
    if (config.n8nWebhookConceptUrl) {
      await $fetch(config.n8nWebhookConceptUrl as string, {
        method: 'POST',
        body: {
          patientName: body.patientName,
          patientEmail: body.patientEmail,
          concept: body.concepto,
          reportUrl: publicUrl
        }
      })
    }

    return { success: true }

  } catch (e: any) {
    console.error("Error generando aptitud:", e)
    throw createError({ statusCode: 500, statusMessage: e.message || 'Error interno' })
  }
})