<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-base">C</span>
            </div>
            <span class="font-semibold text-gray-900 text-xl">Conta</span>
          </div>

          <div class="flex items-center gap-3">
            <!-- Avatar / User menu -->
            <div class="relative" @click.stop>
              <button
                @click.stop="showUserMenu = !showUserMenu"
                class="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div class="flex flex-col items-end leading-tight">
                  <span v-if="periodo" class="text-xs text-blue-600 font-semibold">
                    {{ periodo.created_at ? new Date(periodo.created_at).getDate() : '' }} {{ meses[periodo.mes - 1] }} {{ periodo.anio }}
                  </span>
                  <span class="text-xs text-gray-400">{{ user?.email }}</span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                v-if="showUserMenu"
                @click.stop
                class="absolute right-0 mt-2 w-64 bg-white rounded-xl border-2 border-gray-200 shadow-xl z-20 overflow-hidden"
              >
                <button
                  @click="handleCerrarPeriodo"
                  :disabled="cerrandoPeriodo"
                  class="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="cerrandoPeriodo" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  {{ cerrandoPeriodo ? 'Cerrando...' : 'Cerrar Período' }}
                </button>
                <button
                  @click="irAHistorial"
                  class="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Historial de Períodos
                </button>
                <div class="border-t border-gray-100 mt-1 pt-1">
                  <button
                    @click="handleLogout"
                    :disabled="loggingOut"
                    class="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="loggingOut" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    {{ loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const showUserMenu = ref(false)
const loggingOut = ref(false)
const cerrandoPeriodo = ref(false)
const periodo = ref<{ id: string; mes: number; anio: number } | null>(null)

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']

const userInitial = computed(() => {
  const name = user.value?.user_metadata?.full_name || user.value?.email || 'U'
  return name.charAt(0).toUpperCase()
})

// Cerrar menú al hacer clic fuera
function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}
if (typeof document !== 'undefined') {
  document.addEventListener('click', onClickOutside)
}

// Obtener periodo actual al cargar
onMounted(async () => {
  try {
    const res = await $fetch('/api/periodos')
    periodo.value = res.periodo
  } catch (e) {
    console.error('Error al obtener periodo', e)
  }
})

async function handleLogout() {
  loggingOut.value = true
  await supabase.auth.signOut()
  loggingOut.value = false
  window.location.href = '/login'
}

const cerrarKey = useState('periodo-cerrar-key', () => 0)

async function handleCerrarPeriodo() {
  cerrandoPeriodo.value = true
  try {
    const res = await $fetch('/api/periodos/cerrar', { method: 'POST' })
    periodo.value = res.periodo
    cerrarKey.value++
  } catch (e) {
    console.error('Error al cerrar periodo', e)
  } finally {
    cerrandoPeriodo.value = false
  }
}

function irAHistorial() {
  showUserMenu.value = false
  router.push('/periodos')
}
</script>
