import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const patientId = getRouterParam(event, 'id')

  if (!patientId) {
    throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
  }

  try {
    // 1. Obtener Historial Médico (Consultas)
    const history = await prisma.historiaClinica.findMany({
      where: { paciente_id: Number(patientId) },
      orderBy: { fecha_consulta: 'desc' },
      include: {
        medico: { select: { nombre: true, apellido: true } }, // Asegúrate que la relación en schema se llame 'medico' o 'usuario'
        resultados_examen: {
            include: { tipo_examen: true }
        }
      }
    })

    // 2. Obtener Resultados de Laboratorio (Directo de la tabla de laboratorio)
    // Esto es útil para ver exámenes que no se han vinculado manualmente a una consulta
    const labResults = await prisma.laboratorioResultado.findMany({
        where: {
            muestra: {
                admision_examen: {
                    admision: { paciente_id: Number(patientId) }
                }
            }
        },
        include: {
            muestra: {
                include: { admision_examen: { include: { tipo_examen: true } } }
            }
        }
    })

    return { history, labResults }
  } catch (error) {
    console.error(error)
    return { history: [], labResults: [] }
  }
})