<template>
  <div class="p-6">
    <div v-if="patient" class="mb-6 bg-white p-4 rounded shadow flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-bold text-gray-800">Historia Clínica</h1>
            <p class="text-gray-600">Paciente: {{ patient.nombre }} {{ patient.apellido }} (DNI: {{ patient.dni }})</p>
        </div>
        <button @click="showModal = true" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            + Nueva Consulta
        </button>
    </div>

    <div class="flex border-b mb-4">
        <button @click="tab = 'consultas'" :class="['px-4 py-2', tab==='consultas' ? 'border-b-2 border-indigo-500 text-indigo-600 font-bold' : 'text-gray-500']">Consultas Médicas</button>
        <button @click="tab = 'laboratorio'" :class="['px-4 py-2', tab==='laboratorio' ? 'border-b-2 border-indigo-500 text-indigo-600 font-bold' : 'text-gray-500']">Resultados Laboratorio</button>
    </div>

    <div v-if="tab === 'consultas'" class="space-y-4">
        <div v-if="history.length === 0" class="text-gray-500 italic">No hay consultas registradas.</div>
        <div v-for="item in history" :key="item.id" class="bg-white p-4 rounded shadow border-l-4 border-indigo-500">
            <div class="flex justify-between">
                <span class="font-bold text-lg">{{ new Date(item.fecha_consulta).toLocaleDateString() }}</span>
                <span class="text-sm text-gray-500">Dr. {{ item.medico?.nombre || 'Sistema' }}</span>
            </div>
            <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                    <p class="font-semibold text-xs text-gray-400 uppercase">Motivo</p>
                    <p>{{ item.motivo_consulta }}</p>
                </div>
                <div>
                    <p class="font-semibold text-xs text-gray-400 uppercase">Diagnóstico</p>
                    <p>{{ item.diagnostico }}</p>
                </div>
            </div>
            <div v-if="item.tratamiento" class="mt-2 bg-gray-50 p-2 rounded text-sm">
                <strong>Tratamiento:</strong> {{ item.tratamiento }}
            </div>
        </div>
    </div>

    <div v-if="tab === 'laboratorio'" class="space-y-4">
        <div v-if="labResults.length === 0" class="text-gray-500 italic">No hay resultados de laboratorio.</div>
        <div v-for="res in labResults" :key="res.id" class="bg-white p-4 rounded shadow border-l-4 border-green-500">
            <div class="flex justify-between">
                <span class="font-bold">{{ res.nombre_examen }}</span>
                <span :class="{'text-red-600 font-bold': res.estado === 'Crítico', 'text-green-600': res.estado === 'Normal'}">
                    {{ res.estado }}
                </span>
            </div>
            <div class="mt-2 text-sm">
                <p><strong>Resultado:</strong> {{ res.resultado }}</p>
                <p class="text-gray-500">Referencia: {{ res.valores_referencia }}</p>
            </div>
        </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg w-full max-w-2xl p-6">
            <h2 class="text-xl font-bold mb-4">Nueva Consulta Médica</h2>
            <form @submit.prevent="saveConsulta" class="space-y-4">
                <input v-model="form.motivo" placeholder="Motivo de Consulta" class="w-full border p-2 rounded" required />
                <textarea v-model="form.diagnostico" placeholder="Diagnóstico" class="w-full border p-2 rounded h-24" required></textarea>
                <textarea v-model="form.tratamiento" placeholder="Tratamiento / Receta" class="w-full border p-2 rounded h-24"></textarea>
                <textarea v-model="form.observaciones" placeholder="Observaciones" class="w-full border p-2 rounded"></textarea>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showModal = false" class="px-4 py-2 text-gray-600">Cancelar</button>
                    <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Guardar Historia</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
const route = useRoute()
const tab = ref('consultas')
const patient = ref(null)
const history = ref([])
const labResults = ref([])
const showModal = ref(false)

const form = reactive({ motivo: '', diagnostico: '', tratamiento: '', observaciones: '' })

const loadData = async () => {
    // Cargar datos básicos del paciente
    patient.value = await $fetch(`/api/patients/search`, { method: 'POST', body: { dni: null } }).catch(() => null) 
    // Nota: El endpoint search original requiere DNI. Para hacerlo bien, deberíamos tener un endpoint GET /api/patients/[id].
    // Como atajo, usaremos el listado si no tenemos endpoint de detalle único:
    const allPatients = await $fetch('/api/patients/list')
    patient.value = allPatients.find(p => p.id == route.params.id)

    // Cargar historial
    const data = await $fetch(`/api/patients/${route.params.id}/clinical-history`)
    history.value = data.history
    labResults.value = data.labResults
}

const saveConsulta = async () => {
    try {
        await $fetch('/api/clinical-history/create', {
            method: 'POST',
            body: { ...form, paciente_id: route.params.id }
        })
        showModal.value = false
        loadData() // Recargar
    } catch (e) {
        alert('Error al guardar')
    }
}

onMounted(loadData)
</script>