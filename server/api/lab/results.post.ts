import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { muestra_id, resultado, conclusiones } = body

  // Guardar resultado
  const result = await prisma.laboratorioResultado.create({
    data: {
      muestra_id: Number(muestra_id),
      nombre_examen: "Resultado General", // Puedes personalizar esto
      resultado: resultado,
      valores_referencia: "N/A",
      estado: "Finalizado"
    }
  })

  // Actualizar estado de la muestra
  await prisma.laboratorioMuestra.update({
    where: { id: Number(muestra_id) },
    data: { estado: 'Completado' }
  })

  return result
})