<template>
  <div class="bg-gray-50 p-4 rounded border border-gray-200 mt-4">
    <h4 class="font-bold mb-3">Registrar Nuevo Paciente</h4>
    <form @submit.prevent="save" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input v-model="form.dni" placeholder="DNI" class="border p-2 rounded" required />
      <input v-model="form.nombre" placeholder="Nombre" class="border p-2 rounded" required />
      <input v-model="form.apellido" placeholder="Apellido" class="border p-2 rounded" required />
      <input v-model="form.email" type="email" placeholder="Email" class="border p-2 rounded" />
      <input v-model="form.empresa_ruc" placeholder="RUC Empresa" class="border p-2 rounded" />
      <input v-model="form.empresa_nombre" placeholder="Nombre Empresa" class="border p-2 rounded" />
      
      <div class="md:col-span-2 flex justify-end gap-2">
        <button type="button" @click="$emit('cancel')" class="text-gray-600">Cancelar</button>
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Guardar Paciente</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['saved', 'cancel']);
const form = reactive({ dni: '', nombre: '', apellido: '', email: '', empresa_ruc: '', empresa_nombre: '' });

const save = async () => {
  try {
    // Nota: Necesitas crear este endpoint 'register.post.ts' o usar uno existente
    const patient = await $fetch('/api/patients/register', { method: 'POST', body: form });
    emit('saved', patient);
  } catch (e) {
    alert('Error al registrar');
  }
};
</script>