<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Emisión de Certificados de Aptitud</h1>

    <div class="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <h2 class="text-lg font-semibold mb-4 text-gray-700">Buscar Paciente para Evaluación</h2>
      
      <div class="flex gap-4 mb-8">
        <input 
          v-model="dniSearch" 
          placeholder="Ingrese DNI del Paciente" 
          class="border border-gray-300 p-3 rounded flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          @keyup.enter="searchAdmission"
        />
        <button 
          @click="searchAdmission" 
          class="bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700 transition"
        >
          Buscar
        </button>
      </div>

      <div v-if="admission" class="border border-gray-200 p-6 rounded-lg bg-gray-50 animate-fade-in">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-xl text-gray-800">{{ admission.paciente.nombre }} {{ admission.paciente.apellido }}</h3>
            <p class="text-gray-600">DNI: {{ admission.paciente.dni }}</p>
            <p class="text-gray-600 font-medium">Empresa: {{ admission.empresa?.razon_social || 'Particular' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Fecha de Admisión</p>
            <p class="font-mono font-bold">{{ new Date(admission.fecha_admision).toLocaleDateString() }}</p>
          </div>
        </div>

        <hr class="my-4 border-gray-200">

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Concepto de Aptitud</label>
            <select v-model="certificate.concepto" class="w-full border border-gray-300 p-3 rounded bg-white focus:ring-2 focus:ring-green-500 outline-none">
              <option value="Apto">Apto</option>
              <option value="Apto con Restricciones">Apto con Restricciones</option>
              <option value="No Apto">No Apto</option>
              <option value="Evaluado">Evaluado</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Observaciones / Restricciones</label>
            <textarea 
              v-model="certificate.observaciones" 
              rows="4"
              class="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Detalle aquí las restricciones o comentarios médicos..."
            ></textarea>
          </div>
        </div>

        <button 
          @click="saveCertificate" 
          :disabled="loading"
          class="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          <span v-if="loading">Procesando...</span>
          <span v-else>EMITIR CERTIFICADO DE APTITUD</span>
        </button>
      </div>

      <div v-else class="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
        <Icon name="heroicons:document-text" class="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>Ingrese un DNI para buscar admisiones pendientes</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const dniSearch = ref('');
const admission = ref(null);
const loading = ref(false);
const certificate = reactive({ concepto: 'Apto', observaciones: '' });

const searchAdmission = async () => {
  if (!dniSearch.value) return;
  
  admission.value = null;
  loading.value = true;

  try {
    // 1. Buscamos al paciente
    const paciente = await $fetch(`/api/patients/search`, { 
        method: 'POST', 
        body: { dni: dniSearch.value } 
    });
    
    // 2. Simulamos encontrar su admisión (En producción sería una consulta real a admisiones)
    if(paciente) {
        admission.value = {
            id: 1, // ID Simulado
            paciente: paciente,
            empresa: paciente.empresa, // Asegúrate de que el backend envíe esto
            fecha_admision: new Date()
        }
    }
  } catch (e) {
    alert('Paciente no encontrado o sin admisiones recientes. Verifique el DNI.');
  } finally {
    loading.value = false;
  }
};

const saveCertificate = async () => {
  if (!admission.value) return;
  loading.value = true;

  try {
    // Llamada a la API que creamos anteriormente
    await $fetch('/api/aptitude/create', {
      method: 'POST',
      body: {
        patientName: `${admission.value.paciente.nombre} ${admission.value.paciente.apellido}`,
        patientEmail: admission.value.paciente.email,
        concepto: certificate.concepto,
        observaciones: certificate.observaciones
      }
    });

    alert(`Certificado emitido correctamente. Se ha enviado la notificación (n8n).`);
    
    // Resetear formulario
    admission.value = null; 
    certificate.concepto = 'Apto';
    certificate.observaciones = '';
    dniSearch.value = '';

  } catch (e) {
    console.error(e);
    alert('Error al emitir el certificado. Revise la consola.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>