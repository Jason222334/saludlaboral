import prisma from '../../utils/prisma'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import QRCode from 'qrcode'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { factura_id, metodo_pago } = body

  try {
    // 1. Registrar el Pago y Actualizar Factura
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear registro de pago
      await tx.pago.create({
        data: {
          factura_id: factura_id,
          monto: body.monto,
          fecha_pago: new Date(),
          metodo_pago: metodo_pago || 'Efectivo',
          referencia: `REF-${Date.now()}`
        }
      })

      // Actualizar factura a Pagada
      const factura = await tx.factura.update({
        where: { id: factura_id },
        data: { estado: 'Pagada' },
        include: { admision: { include: { paciente: true } } }
      })
      
      return factura
    })

    // 2. GENERAR BOLETA CON QR
    const fileName = `boleta-${resultado.numero_factura}.pdf`
    const dir = path.join(process.cwd(), 'public', 'boletas')
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, fileName)

    // Generar QR
    const qrData = `BOLETA|${resultado.numero_factura}|${resultado.total}|${new Date().toISOString()}`
    const qrBuffer = await QRCode.toBuffer(qrData)

    const doc = new PDFDocument({ size: [226, 400], margins: { top: 10, bottom: 10, left: 10, right: 10 } })
    doc.pipe(fs.createWriteStream(filePath))

    // Diseño del Ticket
    doc.font('Helvetica-Bold').fontSize(10).text('CLÍNICA SALUD LABORAL', { align: 'center' })
    doc.font('Helvetica').fontSize(8).text('RUC: 20123456789', { align: 'center' })
    doc.moveDown()
    
    doc.text(`Boleta: ${resultado.numero_factura}`)
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`)
    doc.text(`Paciente: ${resultado.admision.paciente.nombre} ${resultado.admision.paciente.apellido}`)
    
    doc.text('--------------------------------', { align: 'center' })
    
    // --- CORRECCIÓN AQUÍ ---
    doc.font('Helvetica-Bold')
       .text(`TOTAL A PAGAR: S/. ${Number(resultado.total).toFixed(2)}`, { align: 'center' })
    doc.font('Helvetica') // Regresar a normal
    // -----------------------

    doc.text('--------------------------------', { align: 'center' })
    doc.moveDown()
    
    // Pegar QR centrado
    // El ancho del papel es 226. Si el QR mide 100, x = (226 - 100) / 2 = 63
    doc.image(qrBuffer, 63, doc.y, { width: 100 })
    
    doc.end()

    return { 
      success: true, 
      boletaUrl: `http://localhost:3000/boletas/${fileName}` 
    }

  } catch (e: any) {
    console.error(e)
    throw createError({ statusCode: 500, statusMessage: 'Error al procesar pago' })
  }
})