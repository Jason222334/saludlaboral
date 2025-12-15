import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // Busca exámenes que ya fueron pagados o están en proceso (simplificado)
  return await prisma.laboratorioMuestra.findMany({
    include: {
      admision_examen: {
        include: {
          tipo_examen: true,
          admision: {
            include: { paciente: true }
          }
        }
      }
    }
  })
})