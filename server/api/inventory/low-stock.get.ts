import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Buscar productos donde el stock actual sea menor o igual al mínimo
    const lowStockProducts = await prisma.productoInventario.findMany({
      where: {
        stock_actual: {
          lte: prisma.productoInventario.fields.stock_minimo
        }
      }
    })
    
    return lowStockProducts
  } catch (error) {
    return []
  }
})