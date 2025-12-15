import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    await prisma.paciente.delete({ where: { id: Number(id) } })
    return { success: true }
  } catch (error) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'No se puede eliminar: El paciente tiene historial clínico o admisiones.' 
    })
  }
})