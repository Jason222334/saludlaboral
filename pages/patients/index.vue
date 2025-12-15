<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Directorio de Pacientes</h1>
      <NuxtLink to="/admissions" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm flex items-center">
        <Icon name="heroicons:plus" class="mr-2" /> Nueva Admisión
      </NuxtLink>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="p in pacientes" :key="p.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ p.nombre }} {{ p.apellido }}</div>
              <div class="text-xs text-gray-500">{{ p.email }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 font-mono">{{ p.dni }}</td>
            <td class="px-6 py-4">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ p.empresa?.razon_social || 'Particular' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium space-x-3 flex items-center">
              <NuxtLink :to="`/patients/${p.id}/clinical-history`" class="text-green-600 hover:text-green-900 flex items-center" title="Ver Historia">
                <Icon name="heroicons:document-text" class="w-5 h-5 mr-1" /> Historia
              </NuxtLink>

              <button @click="editPatient(p)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
              <button @click="deletePatient(p.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
          <tr v-if="!pacientes || pacientes.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-gray-500">No hay pacientes registrados.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">Editar Paciente</h3>
        <form @submit.prevent="saveChanges" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="form.nombre" placeholder="Nombre" class="border p-2 rounded" required />
            <input v-model="form.apellido" placeholder="Apellido" class="border p-2 rounded" required />
          </div>
          <input v-model="form.dni" placeholder="DNI" class="border p-2 rounded w-full" required />
          <input v-model="form.email" type="email" placeholder="Email" class="border p-2 rounded w-full" />
          
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" @click="showModal = false" class="text-gray-600 px-4 py-2">Cancelar</button>
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pacientes = ref([]);
const showModal = ref(false);
const form = reactive({ id: 0, nombre: '', apellido: '', dni: '', email: '' });

const loadPatients = async () => {
  const { data } = await useFetch('/api/patients/list');
  if (data.value) pacientes.value = data.value;
};

// Cargar al inicio
await loadPatients();

const editPatient = (p: any) => {
  Object.assign(form, p);
  showModal.value = true;
};

const saveChanges = async () => {
  try {
    await $fetch(`/api/patients/${form.id}`, { method: 'PUT', body: form });
    showModal.value = false;
    // Recargar lista manualmente para ver cambios
    const data = await $fetch('/api/patients/list');
    pacientes.value = data;
  } catch (e) {
    alert('Error al actualizar');
  }
};

const deletePatient = async (id: number) => {
  if (!confirm('¿Eliminar paciente? Si tiene historial, fallará.')) return;
  try {
    await $fetch(`/api/patients/${id}`, { method: 'DELETE' });
    // Filtrar localmente para que sea rápido
    pacientes.value = pacientes.value.filter((p: any) => p.id !== id);
  } catch (e: any) {
    alert(e.data?.statusMessage || 'No se puede eliminar (tiene registros vinculados)');
  }
};
</script>