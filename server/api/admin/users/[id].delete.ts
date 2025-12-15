import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) }
    })
    return { success: true }
  } catch (error: any) {
    // Error común: El usuario tiene registros vinculados (admisiones, etc.)
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'No se puede eliminar: El usuario tiene registros asociados.' 
    })
  }
})