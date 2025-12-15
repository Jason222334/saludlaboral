import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 1. Buscar o Crear Empresa
  let empresa = await prisma.empresa.findUnique({ where: { ruc: body.empresa_ruc } })
  if (!empresa && body.empresa_ruc) {
    empresa = await prisma.empresa.create({
      data: { ruc: body.empresa_ruc, razon_social: body.empresa_nombre }
    })
  }

  // 2. Crear Paciente
  const paciente = await prisma.paciente.create({
    data: {
      dni: body.dni,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      fecha_nacimiento: new Date(), // Dato obligatorio en esquema, poner mock
      sexo: 'M', // Dato obligatorio, poner mock o agregar al form
      empresa_id: empresa?.id
    },
    include: { empresa: true }
  })

  return paciente
})