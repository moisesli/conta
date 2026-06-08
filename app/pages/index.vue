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
      <button
        @click="mostrarModal = true"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-700 text-base font-medium rounded-lg border border-gray-300 hover:bg-gray-300 hover:border-gray-400 transition-all cursor-pointer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" stroke-width="2"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m-4-4h8"/>
        </svg>
        Agregar
      </button>
    </div>

    <!-- Modal Agregar Registro -->
    <div
      v-if="mostrarModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="cerrarModal"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 p-6 relative">
        <button
          @click="cerrarModal"
          class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6l6 6"/>
          </svg>
        </button>
        <h2 class="text-lg font-bold text-gray-900 mb-5">Nuevo Registro</h2>
        <form @submit.prevent="guardarRegistro" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              v-model="form.descripcion"
              type="text"
              placeholder="Ej: Compra de materiales"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:ring-1 focus:ring-gray-400 transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              v-model="form.monto"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:ring-1 focus:ring-gray-400 transition-all"
            />
          </div>
          <input v-model="form.fecha" type="hidden" />
          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="cerrarModal"
              class="flex-1 inline-flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-600 font-semibold text-base rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke-width="2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6l6 6"/>
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardando"
              class="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-base rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <svg v-if="guardando" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m-3 2a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
        <p v-if="errorMsg" class="mt-3 text-sm text-red-500 text-center">{{ errorMsg }}</p>
      </div>
    </div>

    <!-- Modal Ver / Editar Registro -->
    <div
      v-if="detalleVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click.self="cerrarDetalle"
    >
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 p-6 relative">
        <button
          @click="cerrarDetalle"
          class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke-width="2"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6l6 6"/>
          </svg>
        </button>
        <h2 class="text-lg font-bold text-gray-900 mb-5">Registro</h2>
        <form @submit.prevent="guardarEdicion" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              v-model="detalleForm.descripcion"
              type="text"
              :disabled="!editando"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              :class="editando ? 'focus:ring-1 focus:ring-gray-400' : ''"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              v-model="detalleForm.monto"
              type="number"
              step="0.01"
              :disabled="!editando"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              :class="editando ? 'focus:ring-1 focus:ring-gray-400' : ''"
            />
          </div>
          <input v-model="detalleForm.fecha" type="hidden" />
          <div v-if="!editando" class="flex gap-3 pt-2">
            <button
              type="button"
              @click="cerrarDetalle"
              class="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold text-base rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="button"
              @click="editando = true"
              class="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base rounded-xl transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
          </div>
          <div v-else class="flex gap-3 pt-2">
            <button
              type="button"
              @click="cancelarEdicion"
              class="flex-1 inline-flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-600 font-semibold text-base rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" stroke-width="2"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6l6 6"/>
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="guardandoEdicion"
              class="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-base rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <svg v-if="guardandoEdicion" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m-3 2a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              {{ guardandoEdicion ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
        <p v-if="errorDetalle" class="mt-3 text-sm text-red-500 text-center">{{ errorDetalle }}</p>
      </div>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-visible">
      <div class="min-w-0">
        <table class="w-full text-base">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="text-left pl-8 pr-4 py-3 font-semibold text-gray-600">ID</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Descripción</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
              <th class="text-right pr-5 py-3 font-semibold text-gray-600">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedItems" :key="item.id" class="bg-white hover:bg-gray-50 transition-colors">
              <td class="pl-8 pr-4 py-2 whitespace-nowrap">
                <button
                  @click="abrirDetalle(item)"
                  class="font-semibold text-gray-900 font-mono text-sm cursor-pointer text-left hover:text-gray-600 transition-colors"
                  title="Ver / Editar registro"
                >
                  {{ item.id.slice(0, 8) }}
                </button>
              </td>
              <td class="px-4 py-2 text-gray-700">{{ item.descripcion }}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <div>
                    <div class="text-gray-700 font-medium">{{ formatearFecha(item.fecha) }}</div>
                  </div>
                </div>
              </td>
              <td class="pr-5 py-2 whitespace-nowrap text-right">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  ${{ Number(item.monto).toFixed(2) }}
                </span>
              </td>
            </tr>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="4" class="px-5 py-16 text-center text-gray-400 text-lg">
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
              <td class="pr-5 py-2 text-right">
                <div class="flex items-center justify-end gap-3">
                  <span class="text-base font-semibold text-gray-700">Total</span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${{ Number(totalMonto).toFixed(2) }}
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const search = ref('')
const currentPage = ref(1)
const perPage = 10
const records = ref<any[]>([])
const totalMonto = ref(0)

// Modal nuevo registro
const mostrarModal = ref(false)
const guardando = ref(false)
const errorMsg = ref('')
const form = ref({ descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] })

// Modal detalle / editar
const detalleVisible = ref(false)
const editando = ref(false)
const guardandoEdicion = ref(false)
const errorDetalle = ref('')
const detalleForm = ref({ id: '', descripcion: '', monto: '', fecha: '' })
const detalleItemId = ref<string | null>(null)

onMounted(async () => {
  await cargarRegistros()
})

function cerrarModal() {
  mostrarModal.value = false
  errorMsg.value = ''
  form.value = { descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] }
}

async function guardarRegistro() {
  guardando.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/registros', {
      method: 'POST',
      body: {
        descripcion: form.value.descripcion,
        monto: parseFloat(form.value.monto),
        fecha: form.value.fecha,
      },
    })
    cerrarModal()
    await cargarRegistros()
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Error al guardar'
  } finally {
    guardando.value = false
  }
}

async function cargarRegistros() {
  try {
    const data = await $fetch('/api/registros')
    records.value = data.registros
    totalMonto.value = data.total
  } catch (e) {
    console.error('Error al cargar registros', e)
  }
}

function formatearFecha(fecha: string): string {
  if (!fecha) return ''
  // ISO: "2026-06-08T03:00:00.000Z"
  const partes = fecha.split('T')
  if (partes.length < 2) return fecha
  const hora = partes[1].slice(0, 5) // HH:MM
  return `${partes[0]} ${hora}`
}

// Detalle / Editar
function abrirDetalle(item: any) {
  detalleItemId.value = item.id
  detalleForm.value = {
    id: item.id,
    descripcion: item.descripcion,
    monto: item.monto.toString(),
    fecha: item.fecha.slice(0, 10),
  }
  editando.value = false
  errorDetalle.value = ''
  detalleVisible.value = true
}

function cerrarDetalle() {
  detalleVisible.value = false
  editando.value = false
  detalleItemId.value = null
}

function cancelarEdicion() {
  // Restaurar valores originales
  const item = records.value.find(r => r.id === detalleItemId.value)
  if (item) {
    detalleForm.value = {
      id: item.id,
      descripcion: item.descripcion,
      monto: item.monto.toString(),
      fecha: item.fecha.slice(0, 10),
    }
  }
  editando.value = false
  errorDetalle.value = ''
}

async function guardarEdicion() {
  guardandoEdicion.value = true
  errorDetalle.value = ''
  try {
    await $fetch(`/api/registros/${detalleItemId.value}`, {
      method: 'PUT',
      body: {
        descripcion: detalleForm.value.descripcion,
        monto: parseFloat(detalleForm.value.monto),
        fecha: detalleForm.value.fecha,
      },
    })
    cerrarDetalle()
    await cargarRegistros()
  } catch (e: any) {
    errorDetalle.value = e?.data?.message || 'Error al guardar'
  } finally {
    guardandoEdicion.value = false
  }
}

const filteredItems = computed(() => {
  if (!search.value) return records.value
  const q = search.value.toLowerCase()
  return records.value.filter(
    (r: any) => r.descripcion.toLowerCase().includes(q) || r.fecha.includes(q)
  )
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / perPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredItems.value.slice(start, start + perPage)
})
</script>
