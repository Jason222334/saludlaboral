import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { dni } = body

  if (!dni) {
    throw createError({ statusCode: 400, statusMessage: 'DNI es requerido' })
  }

  const patient = await prisma.paciente.findUnique({
    where: { dni: dni },
    include: { empresa: true }
  })

  if (!patient) {
    throw createError({ statusCode: 404, statusMessage: 'Paciente no encontrado' })
  }

  return patient
})