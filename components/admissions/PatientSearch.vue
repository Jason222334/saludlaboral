<template>
  <div class="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">Buscar Paciente</h3>
    
    <div class="flex gap-4">
      <div class="flex-1 relative">
        <input 
          v-model="dni" 
          type="text" 
          placeholder="Ingrese DNI del paciente" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          @keyup.enter="search"
        />
        <Icon name="heroicons:magnifying-glass" class="absolute right-3 top-3 text-gray-400" />
      </div>
      <button 
        @click="search" 
        :disabled="loading"
        class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {{ loading ? 'Buscando...' : 'Buscar' }}
      </button>
    </div>

    <div v-if="notFound" class="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
      <div class="flex justify-between items-center">
        <span>No se encontró paciente con este DNI.</span>
        <button @click="showRegister = true" class="text-indigo-600 font-bold hover:underline">
          Registrar Nuevo
        </button>
      </div>
      
      <div v-if="showRegister" class="mt-4 border-t border-yellow-200 pt-4">
        <PatientForm @saved="onPatientSaved" @cancel="showRegister = false" />
      </div>
    </div>

    <div v-if="patient" class="mt-4 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
      <div class="font-bold text-lg">{{ patient.nombre }} {{ patient.apellido }}</div>
      <div class="text-sm">Empresa: {{ patient.empresa?.razon_social || 'Particular' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Paciente } from '~/types';
// Asegúrate de que PatientForm.vue exista en la misma carpeta o ajusta la ruta
import PatientForm from './PatientForm.vue'; 

const emit = defineEmits(['patient-found']);

const dni = ref('');
const loading = ref(false);
const notFound = ref(false);
const patient = ref<Paciente | null>(null);
const showRegister = ref(false);

const search = async () => {
  if (!dni.value) return;
  
  loading.value = true;
  notFound.value = false;
  patient.value = null;
  showRegister.value = false; // Ocultar formulario si buscamos de nuevo

  try {
    const data = await $fetch<Paciente>('/api/patients/search', {
      method: 'POST',
      body: { dni: dni.value }
    });
    
    patient.value = data;
    emit('patient-found', data);
  } catch (error: any) {
    if (error.statusCode === 404) {
      notFound.value = true;
    } else {
      alert('Error de conexión');
    }
  } finally {
    loading.value = false;
  }
};

const onPatientSaved = (newPatient: Paciente) => {
  showRegister.value = false;
  notFound.value = false;
  patient.value = newPatient;
  emit('patient-found', newPatient);
};
</script>