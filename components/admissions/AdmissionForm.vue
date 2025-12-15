<template>
  <div class="bg-white p-6 rounded-lg shadow mt-6">
    <h3 class="text-lg font-medium mb-4">Programar Admisión: {{ patient.nombre }}</h3>
    <form @submit.prevent="submit">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Motivo</label>
        <input v-model="motivo" type="text" class="mt-1 block w-full border rounded-md p-2" required />
      </div>
      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Confirmar Admisión
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Paciente } from '~/types/index';

const props = defineProps<{ patient: Paciente }>();
const motivo = ref('Examen Pre-Ingreso');

const submit = async () => {
  try {
    await $fetch('/api/admissions/create', {
      method: 'POST',
      body: { paciente_id: props.patient.id, motivo: motivo.value }
    });
    alert('Admisión creada con éxito');
    navigateTo('/');
  } catch (e) {
    alert('Error al crear admisión');
  }
};
</script>