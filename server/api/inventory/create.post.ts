import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return await prisma.productoInventario.create({
    data: {
        nombre: body.nombre,
        codigo: body.codigo,
        stock_minimo: Number(body.stock_minimo),
        stock_actual: Number(body.stock_actual),
        precio_unitario: Number(body.precio)
    }
  })
})