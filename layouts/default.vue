<template>
  <div class="min-h-screen bg-gray-100 flex">
    <aside class="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div class="p-4 border-b border-gray-700">
        <h1 class="text-2xl font-bold">Salud Laboral</h1>
      </div>
      <nav class="mt-4">
        <NuxtLink to="/" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
          <Icon name="heroicons:home" class="mr-2" /> Dashboard
        </NuxtLink>

        <div v-if="authStore.isDoctor || authStore.isCashier">
          <h3 class="px-4 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Admisiones</h3>
          <NuxtLink to="/admissions" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
            <Icon name="heroicons:clipboard-document-list" class="mr-2" /> Gestión de Turnos
          </NuxtLink>
        </div>

        <NuxtLink to="/patients" class="block px-4 py-2 hover:bg-gray-700 flex items-center text-gray-300 hover:text-white">
          <Icon name="heroicons:users" class="mr-2" /> Directorio Pacientes
        </NuxtLink>

        <div v-if="authStore.isDoctor">
          <h3 class="px-4 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Médico</h3>
          <NuxtLink to="/patients/search" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
            <Icon name="heroicons:magnifying-glass" class="mr-2" /> Buscar Paciente
          </NuxtLink>
        </div>

        <div v-if="authStore.isAdmin">
          <h3 class="px-4 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Administración</h3>
          <NuxtLink to="/admin/users" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
            <Icon name="heroicons:users" class="mr-2" /> Usuarios
          </NuxtLink>
        </div>

        <div v-if="authStore.isAuthenticated">
          <h3 class="px-4 mt-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Clínica</h3>
          <NuxtLink to="/admissions" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
            <Icon name="heroicons:clipboard-document-list" class="mr-2" /> Gestión de Turnos
          </NuxtLink>

          <NuxtLink to="/laboratory" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
              <Icon name="heroicons:beaker" class="mr-2" /> Laboratorio
          </NuxtLink>
          
          <NuxtLink to="/aptitude" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
              <Icon name="heroicons:document-check" class="mr-2" /> Aptitud Médica
          </NuxtLink>
          
          <NuxtLink to="/billing" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
              <Icon name="heroicons:banknotes" class="mr-2" /> Caja
          </NuxtLink>

          <NuxtLink to="/inventory" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
              <Icon name="heroicons:cube" class="mr-2" /> Inventario
          </NuxtLink>
      </div>
      </nav>
    </aside>

    <main class="ml-64 w-full p-8">
      <header class="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800">Sistema Inteligente</h2>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.nombre }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.rol.nombre }}</p>
          </div>
          <button @click="authStore.logout" class="text-red-600 hover:text-red-800" title="Cerrar Sesión">
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-6 h-6" />
          </button>
        </div>
      </header>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

onMounted(() => {
  authStore.initializeAuth();
});
</script>