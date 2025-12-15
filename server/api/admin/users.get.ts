import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  return await prisma.usuario.findMany({
    include: { rol: true }, // <--- ESTO ES CRUCIAL PARA VER EL ROL
    orderBy: { id: 'asc' }
  })
})