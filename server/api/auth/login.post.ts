import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Buscar usuario en BD
  const user = await prisma.usuario.findUnique({
    where: { username: body.username },
    include: { rol: true }
  })

  // Validación simple (En producción usar bcrypt para comparar hash)
  if (!user || user.password_hash !== body.password) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciales incorrectas' })
  }

  // Retornar usuario sin la contraseña
  const { password_hash, ...userWithoutPassword } = user
  return userWithoutPassword
})