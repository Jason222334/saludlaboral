import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Si envían contraseña, la actualizamos. Si viene vacía, la ignoramos.
  const dataToUpdate: any = {
    nombre: body.nombre,
    apellido: body.apellido,
    dni: body.dni,
    username: body.username,
    email: body.email,
    rol_id: Number(body.rol_id)
  }

  if (body.password && body.password.trim() !== '') {
    dataToUpdate.password_hash = body.password // En producción usar bcrypt
  }

  try {
    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dataToUpdate
    })
    return user
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'Error al actualizar usuario' })
  }
})