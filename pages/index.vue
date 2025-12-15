<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard General</h1>
        <p class="text-gray-500">Bienvenido de nuevo, {{ authStore.user?.nombre }}</p>
      </div>
      <div class="text-right">
        <p class="text-sm font-medium text-gray-500">{{ new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="Total Pacientes" :value="data.kpis.totalPatients" icon="heroicons:users" color="blue" />
            <KpiCard title="Admisiones Hoy" :value="data.kpis.todayAdmissions" icon="heroicons:calendar" color="purple" />
            <KpiCard title="Pagos Pendientes" :value="data.kpis.pendingPayments" icon="heroicons:clock" color="yellow" is-currency />
            <div class="bg-white p-6 rounded-lg shadow border-l-4" :class="data.kpis.lowStockCount > 0 ? 'border-red-500' : 'border-green-500'">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase">Alertas Inventario</p>
                        <p class="text-2xl font-bold text-gray-800">{{ data.kpis.lowStockCount }}</p>
                        <p class="text-xs text-gray-500">Productos bajos</p>
                    </div>
                    <div class="p-3 rounded-full" :class="data.kpis.lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                        <Icon name="heroicons:exclamation-triangle" class="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow lg:col-span-2">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Evolución de Ingresos (6 Meses)</h3>
                <div class="h-64">
                    <RevenueChart :labels="data.charts.revenue.labels" :data="data.charts.revenue.data" />
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Resultados de Aptitud</h3>
                <div class="h-64 flex justify-center">
                    <AptitudeChart 
                        v-if="data.charts.aptitude.data.length > 0" 
                        :labels="data.charts.aptitude.labels" 
                        :data="data.charts.aptitude.data" 
                    />
                    <div v-else class="flex items-center text-gray-400 text-sm">
                        No hay datos suficientes
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink to="/admissions" class="group bg-indigo-600 p-6 rounded-lg shadow hover:bg-indigo-700 transition flex items-center justify-between text-white">
                <div>
                    <h3 class="font-bold text-lg">Nueva Admisión</h3>
                    <p class="text-indigo-200 text-sm">Registrar paciente</p>
                </div>
                <Icon name="heroicons:plus-circle" class="w-10 h-10 opacity-50 group-hover:opacity-100 transition" />
            </NuxtLink>

            <NuxtLink to="/billing" class="group bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center justify-between border border-gray-100">
                <div>
                    <h3 class="font-bold text-gray-800 text-lg">Caja</h3>
                    <p class="text-gray-500 text-sm">Ver cobros pendientes</p>
                </div>
                <Icon name="heroicons:banknotes" class="w-10 h-10 text-green-500" />
            </NuxtLink>

            <NuxtLink to="/inventory" class="group bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center justify-between border border-gray-100">
                <div>
                    <h3 class="font-bold text-gray-800 text-lg">Inventario</h3>
                    <p class="text-gray-500 text-sm">Gestionar stock</p>
                </div>
                <Icon name="heroicons:cube" class="w-10 h-10 text-orange-500" />
            </NuxtLink>
        </div>
    </div>
  </div>
</template>

<script setup>
import KpiCard from '~/components/common/KpiCard.vue'
import RevenueChart from '~/components/charts/RevenueChart.vue'
import AptitudeChart from '~/components/charts/AptitudeChart.vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })
const authStore = useAuthStore()

// Usamos useLazyFetch para no bloquear la navegación y mostrar spinner
const { data, pending } = await useLazyFetch('/api/reports/dashboard-kpis')
</script>