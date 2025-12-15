import { defineStore } from 'pinia';
// Asegúrate de que este import apunte a donde definiste tu interfaz
import type { User } from '~/types'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    // ... tus otros getters ...
    isAdmin: (state) => state.user?.rol.nombre === 'Administrador del Sistema',
    isDoctor: (state) => ['Médico Ocupacional', 'Especialista'].includes(state.user?.rol.nombre || ''),
    isCashier: (state) => ['Personal de Admisiones', 'Tesorería'].includes(state.user?.rol.nombre || ''),
    isLab: (state) => state.user?.rol.nombre === 'Personal de Laboratorio',
    isLogistics: (state) => state.user?.rol.nombre === 'Logística',
    isDirector: (state) => state.user?.rol.nombre === 'Dirección',
  },
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        // CORRECCIÓN AQUÍ: Agregamos <User>
        const user = await $fetch<User>('/api/auth/login', {
          method: 'POST',
          body: credentials
        });

        this.user = user;
        this.token = 'jwt-simulado-' + Date.now();
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('auth_user', JSON.stringify(this.user));
        }
        return { success: true };
      } catch (e: any) {
        throw new Error('Credenciales inválidas');
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      return navigateTo('/login');
    },
    initializeAuth() {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        if (token && userStr) {
          this.token = token;
          this.user = JSON.parse(userStr);
        }
      }
    },
  },
});