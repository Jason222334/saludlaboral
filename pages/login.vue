<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Iniciar Sesión</h1>
      <p class="mt-2 text-gray-600">Sistema de Salud Laboral</p>
    </div>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Usuario</label>
        <input v-model="form.username" type="text" class="mt-1 block w-full px-3 py-2 border rounded-md" required />
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input v-model="form.password" type="password" class="mt-1 block w-full px-3 py-2 border rounded-md" required />
      </div>
      <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>
      <button type="submit" :disabled="isLoading" class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
        {{ isLoading ? 'Entrando...' : 'Ingresar' }}
      </button>
    </form>
    <div class="mt-4 text-xs text-gray-500 text-center">
      <p>Demo: admin / password</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'auth'
});

const authStore = useAuthStore();
const form = reactive({ username: '', password: '' });
const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    await authStore.login(form);
    return navigateTo('/');
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};
</script>