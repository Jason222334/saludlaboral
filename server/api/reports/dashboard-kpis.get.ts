import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // --- 1. KPIs Básicos (Contadores) ---
    const [
      totalPatients,
      totalAdmissions,
      todayAdmissions,
      pendingPayments,
      lowStockCount
    ] = await Promise.all([
      prisma.paciente.count(),
      prisma.admision.count(),
      prisma.admision.count({ where: { fecha_admision: { gte: startOfToday } } }),
      prisma.factura.aggregate({ _sum: { total: true }, where: { estado: 'Pendiente' } }),
      prisma.productoInventario.count({ where: { stock_actual: { lte: prisma.productoInventario.fields.stock_minimo } } })
    ]);

    // --- 2. Datos para Gráfica de Ingresos (Últimos 6 meses) ---
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Primer día del mes hace 6 meses

    const facturasRecientes = await prisma.factura.findMany({
        where: {
            fecha_emision: { gte: sixMonthsAgo },
            estado: 'Pagada'
        },
        select: { fecha_emision: true, total: true }
    });

    // CORRECCIÓN AQUÍ: Definimos el tipo explícito para evitar el error de índice
    const ingresosPorMes: Record<string, number> = {};
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Inicializar últimos 6 meses en 0
    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${meses[d.getMonth()]} ${d.getFullYear()}`;
        ingresosPorMes[key] = 0;
    }

    facturasRecientes.forEach(f => {
        const d = new Date(f.fecha_emision);
        const key = `${meses[d.getMonth()]} ${d.getFullYear()}`;
        // Verificamos si la clave existe para seguridad extra, aunque con el bucle anterior ya debería estar
        if (ingresosPorMes[key] !== undefined) {
            ingresosPorMes[key] += Number(f.total);
        }
    });

    // --- 3. Datos para Gráfica de Aptitud (Distribución) ---
    const aptitudStats = await prisma.conceptoAptitud.groupBy({
        by: ['concepto'],
        _count: { concepto: true }
    });

    return {
      kpis: {
        totalPatients,
        totalAdmissions,
        todayAdmissions,
        pendingPayments: pendingPayments._sum.total || 0,
        lowStockCount
      },
      charts: {
        revenue: {
            labels: Object.keys(ingresosPorMes).reverse(),
            data: Object.values(ingresosPorMes).reverse()
        },
        aptitude: {
            labels: aptitudStats.map(a => a.concepto),
            data: aptitudStats.map(a => a._count.concepto)
        }
      }
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Error cargando dashboard' });
  }
});