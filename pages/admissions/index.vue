<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Gestión de Admisiones</h1>
    
    <PatientSearch @patient-found="p => selectedPatient = p" />

    <AdmissionForm v-if="selectedPatient" :patient="selectedPatient" />
  </div>
</template>

<script setup lang="ts">
import PatientSearch from '~/components/admissions/PatientSearch.vue';
import AdmissionForm from '~/components/admissions/AdmissionForm.vue';
import type { Paciente } from '~/types/index';

definePageMeta({ middleware: 'auth' });
const selectedPatient = ref<Paciente | null>(null);
</script>