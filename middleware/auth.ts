import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  // Si no hay usuario y no estamos yendo al login, redirigir
  if (!authStore.user && to.path !== '/login') {
    return navigateTo('/login')
  }
})