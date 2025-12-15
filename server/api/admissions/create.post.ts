import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Crear la admisión
      const admision = await tx.admision.create({
        data: {
          paciente_id: body.paciente_id,
          fecha_admision: new Date(),
          motivo: body.motivo,
          estado: 'Pendiente',
          examenes: {
            create: [
                { tipo_examen_id: 1, fecha_programada: new Date() } 
            ]
          }
        },
        include: {
          paciente: { include: { empresa: true } },
          examenes: { include: { tipo_examen: true } }
        }
      })

      // 2. CREAR FACTURA PRELIMINAR (DEUDA)
      // Calculamos un precio base simulado (ej: 150 soles)
      const montoTotal = 150.00; 
      
      await tx.factura.create({
        data: {
          admision_id: admision.id,
          empresa_id: admision.empresa_id, // Si es null, es particular
          numero_factura: `F-${Date.now()}`, // Número único
          fecha_emision: new Date(),
          subtotal: montoTotal,
          igv: 0, // Simplificado
          total: montoTotal,
          estado: 'Pendiente' // Importante: Nace como pendiente de pago
        }
      })

      // 3. Generar Muestras de Laboratorio
      for (const examen of admision.examenes) {
        await tx.laboratorioMuestra.create({
          data: {
            admision_examen_id: examen.id,
            codigo_muestra: `LAB-${Date.now()}-${examen.id}`,
            fecha_recepcion: new Date(),
            estado: 'Pendiente'
          }
        })
      }

      return admision
    })

    // 4. Notificación n8n
    if (config.n8nWebhookUrl) {
      try {
        await $fetch(config.n8nWebhookUrl as string, {
          method: 'POST',
          body: {
            patientName: `${result.paciente.nombre} ${result.paciente.apellido}`,
            patientEmail: result.paciente.email,
            companyName: result.paciente.empresa?.razon_social || 'Particular',
            admissionDate: new Date().toLocaleDateString(),
            motive: body.motivo
          }
        })
      } catch (e) { console.error(e) }
    }

    return result

  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Error interno' })
  }
})