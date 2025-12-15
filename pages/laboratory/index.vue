<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Laboratorio Clínico</h1>

    <div class="grid gap-4">
      <div v-for="sample in samples" :key="sample.id" class="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-lg">{{ sample.admision_examen?.tipo_examen?.nombre }}</h3>
            <p class="text-gray-600">Paciente: {{ sample.admision_examen?.admision?.paciente?.nombre }} {{ sample.admision_examen?.admision?.paciente?.apellido }}</p>
            <p class="text-sm text-gray-500">Código Muestra: {{ sample.codigo_muestra }}</p>
          </div>
          <span :class="getStatusClass(sample.estado)" class="px-2 py-1 rounded text-xs text-white">
            {{ sample.estado }}
          </span>
        </div>

        <div v-if="sample.estado !== 'Completado'" class="mt-4 pt-4 border-t">
          <textarea v-model="results[sample.id]" placeholder="Ingrese resultados aquí..." class="w-full border p-2 rounded text-sm mb-2"></textarea>
          <button @click="saveResult(sample.id)" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
            Guardar y Finalizar
          </button>
        </div>
      </div>
      
      <div v-if="samples.length === 0" class="text-center text-gray-500 p-8 bg-white rounded">
        No hay muestras pendientes en este momento.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const samples = ref([]);
const results = reactive({}); // Almacena texto temporalmente

const loadSamples = async () => {
  // Nota: Si no tienes muestras creadas, esta lista estará vacía.
  // Necesitas crear una admisión, y luego (manualmente o por lógica) crear la muestra en BD.
  samples.value = await $fetch('/api/lab/samples');
};

const saveResult = async (id) => {
  if(!results[id]) return alert('Escriba un resultado');
  
  await $fetch('/api/lab/results', {
    method: 'POST',
    body: { muestra_id: id, resultado: results[id] }
  });
  
  alert('Resultado guardado');
  await loadSamples();
};

const getStatusClass = (status) => {
  return status === 'Completado' ? 'bg-green-500' : 'bg-yellow-500';
}

onMounted(loadSamples);
</script>