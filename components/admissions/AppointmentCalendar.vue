<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
      <h3 class="font-bold text-gray-700">Turnos Programados (Hoy)</h3>
      <span class="text-sm text-gray-500">{{ new Date().toLocaleDateString() }}</span>
    </div>
    
    <div class="divide-y divide-gray-100">
      <div v-for="i in 5" :key="i" class="p-4 flex items-center hover:bg-gray-50 transition">
        <div class="w-16 text-center text-gray-500 font-mono text-sm">
          {{ 8 + i }}:00
        </div>
        <div class="flex-1 ml-4">
          <div class="font-medium text-gray-900">Paciente Simulado {{ i }}</div>
          <div class="text-xs text-gray-500">Examen Pre-Ocupacional • Dr. Medina</div>
        </div>
        <div>
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Confirmado
          </span>
        </div>
      </div>
    </div>
  </div>
</template>