import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  // CORRECCIÓN: Quitamos el 'where' para que traiga TODAS (Pendientes y Pagadas)
  return await prisma.factura.findMany({
    include: {
      admision: {
        include: { paciente: true }
      },
      empresa: true
    },
    orderBy: { fecha_emision: 'desc' } // Las más recientes primero
  })
})