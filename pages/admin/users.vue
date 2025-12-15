<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
      <button @click="openModal()" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center">
        <Icon name="heroicons:plus" class="mr-2" /> Nuevo Usuario
      </button>
    </div>

    <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
      {{ errorMsg }}
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium">{{ user.username }}</td>
            <td class="px-6 py-4">{{ user.nombre }} {{ user.apellido }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ user.rol?.nombre || 'N/A' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <button @click="openModal(user)" class="text-indigo-600 hover:text-indigo-900">
                <Icon name="heroicons:pencil-square" class="w-5 h-5" />
              </button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:text-red-900">
                <Icon name="heroicons:trash" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="form.nombre" placeholder="Nombre" class="border p-2 rounded w-full" required />
            <input v-model="form.apellido" placeholder="Apellido" class="border p-2 rounded w-full" required />
          </div>
          <input v-model="form.dni" placeholder="DNI" class="border p-2 rounded w-full" required />
          <input v-model="form.username" placeholder="Usuario" class="border p-2 rounded w-full" required />
          <input v-model="form.email" type="email" placeholder="Email" class="border p-2 rounded w-full" required />
          
          <div>
            <input v-model="form.password" type="password" :placeholder="isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'" class="border p-2 rounded w-full" :required="!isEditing" />
            <p v-if="isEditing" class="text-xs text-gray-500 mt-1">Dejar en blanco para mantener la actual.</p>
          </div>
          
          <select v-model="form.rol_id" class="border p-2 rounded w-full bg-white">
            <option :value="1">Administrador</option>
            <option :value="2">Médico Ocupacional</option>
            <option :value="3">Admisiones / Caja</option>
            <option :value="4">Laboratorio</option>
          </select>

          <div class="flex justify-end space-x-2 mt-6">
            <button @click="showModal = false" type="button" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
            <button type="submit" :disabled="loading" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const users = ref([]);
const showModal = ref(false);
const loading = ref(false);
const errorMsg = ref('');
const isEditing = ref(false);
const editId = ref<number | null>(null);

const initialForm = { nombre: '', apellido: '', dni: '', username: '', email: '', password: '', rol_id: 2 };
const form = reactive({ ...initialForm });

const loadUsers = async () => {
  try {
    users.value = await $fetch('/api/admin/users') || [];
  } catch (e: any) { errorMsg.value = e.message; }
};

const openModal = (user: any = null) => {
  errorMsg.value = '';
  if (user) {
    isEditing.value = true;
    editId.value = user.id;
    Object.assign(form, { ...user, password: '' }); // No mostramos la pass
  } else {
    isEditing.value = false;
    editId.value = null;
    Object.assign(form, initialForm);
  }
  showModal.value = true;
};

const saveUser = async () => {
  loading.value = true;
  errorMsg.value = '';
  try {
    if (isEditing.value && editId.value) {
      await $fetch(`/api/admin/users/${editId.value}`, { method: 'PUT', body: form });
    } else {
      await $fetch('/api/admin/users', { method: 'POST', body: { ...form, rol_id: Number(form.rol_id) } });
    }
    showModal.value = false;
    await loadUsers();
  } catch (e: any) {
    errorMsg.value = e.data?.statusMessage || 'Error al guardar.';
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id: number) => {
  if (!confirm('¿Seguro de eliminar este usuario?')) return;
  try {
    await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    await loadUsers();
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Error al eliminar');
  }
};

onMounted(loadUsers);
</script>