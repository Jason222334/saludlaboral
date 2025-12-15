<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps(['labels', 'data'])

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'], // Green, Amber, Red, Blue
    data: props.data
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' }
  }
}
</script>