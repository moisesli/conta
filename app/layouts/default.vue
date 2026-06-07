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
            <!-- Botón Nuevo Período -->
            <button class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-600 text-base font-medium rounded-lg border border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 transition-all cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Nuevo Período
            </button>

            <!-- Avatar / User menu -->
            <div class="relative" @click.stop>
              <button
                @click.stop="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ userInitial }}
                </div>
              </button>

              <!-- Dropdown -->
              <div
                v-if="showUserMenu"
                @click.stop
                class="absolute right-0 mt-2 w-64 bg-white rounded-xl border-2 border-gray-200 shadow-xl z-20 overflow-hidden"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ user?.user_metadata?.full_name || 'Usuario' }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  :disabled="loggingOut"
                  class="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="loggingOut" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  {{ loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}
                </button>
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

async function handleLogout() {
  loggingOut.value = true
  await supabase.auth.signOut()
  loggingOut.value = false
  router.push('/login')
}
</script>
