// Archivo: server/api/patients/list.get.ts
import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Busca todos los pacientes y trae también los datos de su empresa
    const pacientes = await prisma.paciente.findMany({
      include: {
        empresa: true
      },
      orderBy: {
        id: 'desc' // Muestra los más nuevos primero
      }
    })
    return pacientes
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al obtener la lista de pacientes',
    })
  }
})