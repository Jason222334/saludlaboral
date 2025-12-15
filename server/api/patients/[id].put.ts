import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    const paciente = await prisma.paciente.update({
      where: { id: Number(id) },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        dni: body.dni,
        email: body.email,
        // En un sistema real se actualizaría la empresa también
      }
    })
    return paciente
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error actualizando paciente' })
  }
})