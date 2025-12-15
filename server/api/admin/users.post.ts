import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password, nombre, apellido, dni, rol_id } = body
  
  // Nota: Rol por defecto si no se envía (ajusta el ID según tus roles en DB)
  // Asegúrate de que el rol_id exista en la tabla Role antes de crear el usuario
  
  return await prisma.usuario.create({
    data: {
      username, 
      email, 
      password_hash: password, // En producción usar bcrypt
      nombre, 
      apellido, 
      dni, 
      rol_id: Number(rol_id)
    }
  })
})