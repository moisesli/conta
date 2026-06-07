<template>
  <div>
    <!-- Barra de búsqueda y botón -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
      <div class="relative w-full sm:w-64">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar registros..."
          class="w-full bg-white pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
      </div>
      <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-base font-medium rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nuevo Registro
      </button>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-base">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="text-left pl-8 pr-4 py-3 font-semibold text-gray-600">ID</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Descripción</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
              <th class="text-right px-4 py-3 font-semibold text-gray-600">Monto</th>
              <th class="text-center px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedItems" :key="item.id" class="bg-white hover:bg-gray-50 transition-colors">
              <td class="pl-8 pr-4 py-2 whitespace-nowrap">
                <span class="text-gray-900 font-mono">{{ item.id }}</span>
              </td>
              <td class="px-4 py-2 text-gray-700">{{ item.descripcion }}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <div class="text-gray-700 font-medium">{{ item.fecha }}</div>
                    <div class="text-gray-400 text-xs">{{ item.hora }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-right">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  ${{ item.monto.toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-2 text-center relative">
                <button
                  @click.stop="toggleDropdown(item.id)"
                  class="inline-flex items-center justify-center p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Acciones"
                >
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </button>
                <div
                  v-if="openDropdownId === item.id"
                  class="absolute right-8 -mt-2 w-32 bg-white rounded-lg border-2 border-gray-200 shadow-lg z-10 py-1 text-left"
                >
                  <button class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    Ver
                  </button>
                  <button class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                    <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Editar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="5" class="px-5 py-16 text-center text-gray-400 text-lg">
                No hay registros aún
              </td>
            </tr>
          </tbody>
          <tfoot v-if="records.length > 0">
            <tr class="border-t border-gray-200">
              <td colspan="3" class="pl-8 pr-4 py-2">
                <div v-if="totalPages > 1" class="flex items-center gap-1">
                  <button
                    :disabled="currentPage === 1"
                    class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    @click="currentPage--"
                  >
                    Anterior
                  </button>
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    :class="[
                      'px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer',
                      page === currentPage
                        ? 'border-blue-600 text-blue-600 bg-blue-50 font-medium'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    ]"
                    @click="currentPage = page"
                  >
                    {{ page }}
                  </button>
                  <button
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    @click="currentPage++"
                  >
                    Siguiente
                  </button>
                </div>
              </td>
              <td class="px-4 py-2 text-right">
                <div class="flex items-center justify-end gap-3">
                  <span class="text-base font-semibold text-gray-700">Total</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${{ totalMonto.toLocaleString() }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const search = ref('')
const currentPage = ref(1)
const perPage = 10
const openDropdownId = ref<number | null>(null)

function toggleDropdown(id: number) {
  openDropdownId.value = openDropdownId.value === id ? null : id
}

function closeDropdown() {
  openDropdownId.value = null
}

// Cerrar dropdown al hacer clic fuera
if (typeof document !== 'undefined') {
  document.addEventListener('click', closeDropdown)
}

const records = ref([
  { id: 1, descripcion: 'Compra de materiales de oficina', fecha: '2026-06-01', hora: '09:15 AM', monto: 1250.00 },
  { id: 2, descripcion: 'Pago de servicios de internet', fecha: '2026-06-02', hora: '10:30 AM', monto: 89.99 },
  { id: 3, descripcion: 'Cena con cliente', fecha: '2026-06-03', hora: '08:45 PM', monto: 345.50 },
  { id: 4, descripcion: 'Suscripción mensual SaaS', fecha: '2026-06-04', hora: '07:00 AM', monto: 29.99 },
  { id: 5, descripcion: 'Gasolina vehículo empresa', fecha: '2026-06-05', hora: '12:20 PM', monto: 78.40 },
  { id: 6, descripcion: 'Mantenimiento de equipo', fecha: '2026-06-06', hora: '03:10 PM', monto: 560.00 },
  { id: 7, descripcion: 'Capacitación empleados', fecha: '2026-06-06', hora: '09:00 AM', monto: 2500.00 },
  { id: 8, descripcion: 'Compra de licencias software', fecha: '2026-06-05', hora: '11:45 AM', monto: 999.00 },
  { id: 9, descripcion: 'Servicio de mensajería', fecha: '2026-06-04', hora: '02:30 PM', monto: 45.00 },
  { id: 10, descripcion: 'Renta de oficina junio', fecha: '2026-06-03', hora: '08:00 AM', monto: 1500.00 },
  { id: 11, descripcion: 'Material de empaque', fecha: '2026-06-02', hora: '04:15 PM', monto: 234.75 },
  { id: 12, descripcion: 'Pago nómina empleados', fecha: '2026-06-01', hora: '01:00 PM', monto: 8500.00 },
])

const filteredItems = computed(() => {
  if (!search.value) return records.value
  const q = search.value.toLowerCase()
  return records.value.filter(
    r => r.id.toString().includes(q) || r.descripcion.toLowerCase().includes(q) || r.fecha.includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / perPage))

const totalMonto = computed(() => records.value.reduce((sum, r) => sum + r.monto, 0))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredItems.value.slice(start, start + perPage)
})
</script>
