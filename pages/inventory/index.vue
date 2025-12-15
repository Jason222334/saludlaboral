<template>
  <div class="p-6">
    <div class="flex justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        <button @click="showCreateModal = true" class="bg-indigo-600 text-white px-4 py-2 rounded">
            + Nuevo Producto
        </button>
    </div>

    <div class="bg-white shadow rounded overflow-hidden">
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b">
                <tr>
                    <th class="p-4">Código</th>
                    <th class="p-4">Producto</th>
                    <th class="p-4 text-center">Stock Actual</th>
                    <th class="p-4 text-center">Estado</th>
                    <th class="p-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="prod in products" :key="prod.id" class="border-b hover:bg-gray-50">
                    <td class="p-4 font-mono text-sm">{{ prod.codigo }}</td>
                    <td class="p-4 font-bold">{{ prod.nombre }}</td>
                    <td class="p-4 text-center text-lg">{{ prod.stock_actual }}</td>
                    <td class="p-4 text-center">
                        <span v-if="prod.stock_actual <= prod.stock_minimo" class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded font-bold">STOCK BAJO</span>
                        <span v-else class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">OK</span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                        <button @click="openMoveModal(prod, 'Entrada')" class="text-green-600 hover:underline text-sm">Entrada</button>
                        <button @click="openMoveModal(prod, 'Salida')" class="text-red-600 hover:underline text-sm">Salida</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showMoveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white p-6 rounded w-96">
            <h2 class="font-bold text-lg mb-4">{{ moveType }} de Inventario</h2>
            <p class="mb-4 text-gray-600">{{ selectedProduct?.nombre }}</p>
            <form @submit.prevent="saveMovement">
                <input v-model="moveQty" type="number" min="1" placeholder="Cantidad" class="w-full border p-2 rounded mb-2" required />
                <input v-model="moveReason" type="text" placeholder="Motivo (ej: Compra, Uso interno)" class="w-full border p-2 rounded mb-4" required />
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showMoveModal = false" class="text-gray-500">Cancelar</button>
                    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Confirmar</button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white p-6 rounded w-96">
            <h2 class="font-bold text-lg mb-4">Nuevo Producto</h2>
            <form @submit.prevent="createProduct" class="space-y-3">
                <input v-model="newProd.codigo" placeholder="Código (ej: GUANTES-M)" class="w-full border p-2 rounded" required />
                <input v-model="newProd.nombre" placeholder="Nombre" class="w-full border p-2 rounded" required />
                <input v-model="newProd.stock_actual" type="number" placeholder="Stock Inicial" class="w-full border p-2 rounded" required />
                <input v-model="newProd.stock_minimo" type="number" placeholder="Stock Mínimo" class="w-full border p-2 rounded" required />
                <input v-model="newProd.precio" type="number" placeholder="Precio Unitario" class="w-full border p-2 rounded" />
                <div class="flex justify-end gap-2 mt-4">
                    <button type="button" @click="showCreateModal = false" class="text-gray-500">Cancelar</button>
                    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
                </div>
            </form>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const products = ref([])
const showMoveModal = ref(false)
const showCreateModal = ref(false)
const selectedProduct = ref(null)
const moveType = ref('Entrada')
const moveQty = ref(1)
const moveReason = ref('')

const newProd = reactive({ codigo: '', nombre: '', stock_actual: 0, stock_minimo: 10, precio: 0 })

const loadProducts = async () => {
    products.value = await $fetch('/api/inventory/products')
}

const openMoveModal = (prod, type) => {
    selectedProduct.value = prod
    moveType.value = type
    moveQty.value = 1
    moveReason.value = ''
    showMoveModal.value = true
}

const saveMovement = async () => {
    try {
        await $fetch('/api/inventory/movement', {
            method: 'POST',
            body: {
                producto_id: selectedProduct.value.id,
                tipo: moveType.value,
                cantidad: moveQty.value,
                motivo: moveReason.value
            }
        })
        showMoveModal.value = false
        loadProducts()
    } catch (e) {
        alert(e.data?.statusMessage || 'Error al mover stock')
    }
}

const createProduct = async () => {
    try {
        await $fetch('/api/inventory/create', { method: 'POST', body: newProd })
        showCreateModal.value = false
        loadProducts()
    } catch (e) {
        alert('Error al crear producto')
    }
}

onMounted(loadProducts)
</script>