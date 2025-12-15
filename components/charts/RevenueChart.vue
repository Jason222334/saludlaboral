<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps(['labels', 'data'])

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    label: 'Ingresos (S/.)',
    backgroundColor: '#4F46E5', // Indigo 600
    data: props.data,
    borderRadius: 4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}
</script>