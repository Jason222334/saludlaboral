import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // En un sistema real, obtenemos el ID del médico logueado de la sesión
  // Aquí simulamos buscando al primer usuario con rol médico o admin
  const medico = await prisma.usuario.findFirst();

  const entry = await prisma.historiaClinica.create({
    data: {
      paciente_id: Number(body.paciente_id),
      medico_id: medico?.id, 
      fecha_consulta: new Date(),
      motivo_consulta: body.motivo,
      diagnostico: body.diagnostico,
      tratamiento: body.tratamiento,
      observaciones: body.observaciones
    }
  })
  
  return entry
})