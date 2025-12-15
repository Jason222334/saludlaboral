<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Caja y Facturación</h1>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="factura in facturas" :key="factura.id" :class="{'bg-gray-50': factura.estado === 'Pagada'}">
            <td class="px-6 py-4 font-mono text-sm">{{ factura.numero_factura }}</td>
            <td class="px-6 py-4">
              {{ factura.admision.paciente.nombre }} {{ factura.admision.paciente.apellido }}
              <div class="text-xs text-gray-400">{{ factura.admision.paciente.dni }}</div>
            </td>
            <td class="px-6 py-4 font-bold text-gray-700">S/. {{ factura.total }}</td>
            
            <td class="px-6 py-4">
              <span v-if="factura.estado === 'Pendiente'" class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                Pendiente
              </span>
              <span v-else class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold flex items-center w-fit">
                <Icon name="heroicons:check-circle" class="mr-1" /> Pagada
              </span>
            </td>

            <td class="px-6 py-4">
              <button 
                v-if="factura.estado === 'Pendiente'"
                @click="cobrar(factura)" 
                :disabled="procesando === factura.id"
                class="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50 text-sm shadow-sm transition"
              >
                {{ procesando === factura.id ? '...' : 'Cobrar' }}
              </button>

              <button 
                v-else
                @click="verBoleta(factura.numero_factura)" 
                class="border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 text-sm flex items-center transition"
              >
                <Icon name="heroicons:document-text" class="mr-1" /> Boleta
              </button>
            </td>
          </tr>
          
          <tr v-if="facturas.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-gray-500">
              No hay registros de facturación.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const facturas = ref([]);
const procesando = ref<number | null>(null);

const cargarFacturas = async () => {
  try {
    const data = await $fetch('/api/billing/pending'); // Sigue llamando al mismo endpoint, pero ahora trae todo
    facturas.value = data;
  } catch (e) {
    console.error(e);
  }
};

const cobrar = async (factura: any) => {
  if (!confirm(`¿Confirmar cobro de S/. ${factura.total}?`)) return;

  procesando.value = factura.id;
  try {
    const res = await $fetch('/api/billing/pay', {
      method: 'POST',
      body: { 
        factura_id: factura.id, 
        monto: factura.total,
        metodo_pago: 'Efectivo' 
      }
    });

    // Abrir boleta al instante
    if (res.boletaUrl) {
        window.open(res.boletaUrl, '_blank');
    }
    
    await cargarFacturas(); // Refrescar para ver el cambio de estado
  } catch (e) {
    alert('Error al procesar el pago');
  } finally {
    procesando.value = null;
  }
};

// Función para abrir la boleta en cualquier momento
const verBoleta = (numeroFactura: string) => {
  // Construimos la URL basándonos en el patrón que definimos en el backend
  const url = `/boletas/boleta-${numeroFactura}.pdf`;
  window.open(url, '_blank');
};

onMounted(cargarFacturas);
</script>