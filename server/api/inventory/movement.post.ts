import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const { producto_id, tipo, cantidad, motivo } = body

  try {
    // 1. Ejecutar el movimiento en BD
    const resultado = await prisma.$transaction(async (tx) => {
      // Registrar historial
      await tx.movimientoInventario.create({
        data: {
          producto_id: Number(producto_id),
          tipo_movimiento: tipo,
          cantidad: Number(cantidad),
          motivo: motivo,
          fecha_movimiento: new Date()
        }
      })

      // Obtener producto actual
      const producto = await tx.productoInventario.findUnique({ where: { id: Number(producto_id) } })
      if (!producto) throw new Error("Producto no encontrado")

      // Calcular nuevo stock
      const nuevoStock = tipo === 'Entrada' 
          ? producto.stock_actual + Number(cantidad)
          : producto.stock_actual - Number(cantidad)

      if (nuevoStock < 0) throw createError({ statusCode: 400, statusMessage: 'Stock insuficiente' })

      // Actualizar producto
      const actualizado = await tx.productoInventario.update({
          where: { id: Number(producto_id) },
          data: { stock_actual: nuevoStock }
      })

      return actualizado
    })

    // ---------------------------------------------------------
    // 2. LÓGICA DE ALERTA EN TIEMPO REAL (NUEVO)
    // Si es una SALIDA y el stock quedó igual o menor al mínimo...
    if (tipo === 'Salida' && resultado.stock_actual <= resultado.stock_minimo) {
        if (config.n8nWebhookLowStockUrl) {
            // Disparamos la alerta a n8n sin esperar respuesta (fire & forget)
            $fetch(config.n8nWebhookLowStockUrl as string, {
                method: 'POST',
                body: {
                    productName: resultado.nombre,
                    productCode: resultado.codigo,
                    currentStock: resultado.stock_actual,
                    minStock: resultado.stock_minimo
                }
            }).catch(e => console.error("Error enviando alerta stock:", e))
        }
    }
    // ---------------------------------------------------------

    return resultado

  } catch (e: any) {
    throw createError({ statusCode: 500, statusMessage: e.message })
  }
})