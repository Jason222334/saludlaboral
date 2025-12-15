import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Crear Roles Básicos
  const roles = [
    { id: 1, nombre: 'Administrador del Sistema', descripcion: 'Acceso total' },
    { id: 2, nombre: 'Médico Ocupacional', descripcion: 'Atención médica y aptitud' },
    { id: 3, nombre: 'Personal de Admisiones', descripcion: 'Caja y registro' },
    { id: 4, nombre: 'Personal de Laboratorio', descripcion: 'Procesamiento de muestras' },
    { id: 5, nombre: 'Logística', descripcion: 'Inventario' },
    { id: 6, nombre: 'Dirección', descripcion: 'Reportes' },
  ]

  console.log('🌱 Sembrando roles...')
  for (const rol of roles) {
    await prisma.role.upsert({
      where: { id: rol.id },
      update: {},
      create: rol,
    })
  }

  // 2. Crear Tipos de Examen Básicos
  const examenes = [
    { nombre: 'Examen Médico General', precio: 50.00 },
    { nombre: 'Audiometría', precio: 35.00 },
    { nombre: 'Espirometría', precio: 40.00 },
    { nombre: 'Psicología', precio: 30.00 },
    { nombre: 'Laboratorio Básico', precio: 45.00 },
  ]

  console.log('🌱 Sembrando exámenes...')
  for (const examen of examenes) {
    // Verificar si existe para no duplicar
    const existe = await prisma.tipoExamen.findFirst({ where: { nombre: examen.nombre }})
    if (!existe) {
      await prisma.tipoExamen.create({ data: examen })
    }
  }

  console.log('✅ Base de datos poblada correctamente.')

  const admin = await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@clinica.com',
      password_hash: 'password', // Contraseña plana por ahora
      nombre: 'Super',
      apellido: 'Admin',
      dni: '00000000',
      rol_id: 1 // Asumiendo que 1 es Administrador según el paso anterior
    }
  })
  console.log('👤 Usuario admin creado: admin / password')

  // 4. Crear Categorías de Inventario
  const categorias = ['Medicamentos', 'Insumos de Laboratorio', 'EPP', 'Papelería']
  for (const cat of categorias) {
    await prisma.categoriaInventario.upsert({
        where: { id: categorias.indexOf(cat) + 1 }, // ID simulado
        update: {},
        create: { nombre: cat }
    })
  }

  // 5. Crear Productos de Inventario
  const productos = [
    { codigo: 'MED-001', nombre: 'Paracetamol 500mg', stock_actual: 500, stock_minimo: 100, precio: 0.50, categoria_id: 1 },
    { codigo: 'MED-002', nombre: 'Alcohol 96° 1L', stock_actual: 50, stock_minimo: 10, precio: 15.00, categoria_id: 1 },
    { codigo: 'LAB-001', nombre: 'Tubos de Ensayo (Rojos)', stock_actual: 1000, stock_minimo: 200, precio: 1.20, categoria_id: 2 },
    { codigo: 'LAB-002', nombre: 'Agujas Vacutainer', stock_actual: 800, stock_minimo: 150, precio: 0.80, categoria_id: 2 },
    { codigo: 'EPP-001', nombre: 'Guantes de Nitrilo (M)', stock_actual: 5, stock_minimo: 20, precio: 25.00, categoria_id: 3 }, // Stock BAJO a propósito
    { codigo: 'EPP-002', nombre: 'Mascarillas N95', stock_actual: 200, stock_minimo: 50, precio: 5.00, categoria_id: 3 },
  ]

  console.log('📦 Sembrando inventario...')
  for (const prod of productos) {
    const { categoria_id, precio, ...data } = prod
    await prisma.productoInventario.upsert({
        where: { codigo: prod.codigo },
        update: {},
        create: {
            ...data,
            precio_unitario: precio,
            categoria_id // Asumiendo que las categorías se crearon con IDs secuenciales
        }
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })