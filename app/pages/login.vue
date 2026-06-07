<template>
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <!-- Logo -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
          <span class="text-white font-bold text-2xl">C</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-900">{{ needsConfirmPassword ? 'Registro' : 'Login' }}</h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ needsConfirmPassword ? 'Confirma tu contraseña para registrarte' : 'Inicia sesión con tu cuenta' }}
        </p>
      </div>

      <!-- Google button -->
      <button
        type="button"
        class="w-full flex items-center justify-center gap-3 px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium text-base bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer mb-4"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>

      <!-- Divider -->
      <div class="flex items-center gap-4 mb-6">
        <div class="flex-1 h-px bg-gray-200"></div>
        <span class="text-sm text-gray-400 font-medium">o</span>
        <div class="flex-1 h-px bg-gray-200"></div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            placeholder="tu@correo.com"
            required
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:ring-1 focus:ring-gray-400 transition-all"
            :class="{ 'border-red-300 focus:ring-1 focus:ring-red-300': errors.email }"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 6 caracteres"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:ring-1 focus:ring-gray-400 transition-all pr-11"
              :class="{ 'border-red-300 focus:ring-1 focus:ring-red-300': errors.password }"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <!-- Confirm password (se muestra cuando el email no existe) -->
        <div v-if="needsConfirmPassword" class="animate-fade-in">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
          <div class="relative">
            <input
              ref="confirmInputRef"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Repite la contraseña"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:ring-1 focus:ring-gray-400 transition-all pr-11"
              :class="{ 'border-red-300 focus:ring-1 focus:ring-red-300': errors.confirmPassword }"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-base rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          {{ loading ? 'Procesando...' : needsConfirmPassword ? 'Crear cuenta' : 'Iniciar sesión' }}
        </button>

        <!-- Recuperar contraseña (solo en modo login) -->
        <p v-if="!needsConfirmPassword" class="text-center text-sm text-gray-400 mt-3">
          <button
            type="button"
            @click="handleForgotPassword"
            class="hover:text-gray-600 transition-colors cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>
      </form>

      <!-- Mensaje de error / info general -->
      <p v-if="errors.general" class="mt-4 text-sm text-center" :class="messageClass">{{ errors.general }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'

definePageMeta({
  layout: 'aut',
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const confirmInputRef = ref<HTMLInputElement | null>(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const needsConfirmPassword = ref(false)

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  general: '',
})

const messageClass = computed(() => {
  const msg = errors.general
  if (!msg) return ''
  // Mensajes de éxito
  if (msg.includes('creada') || msg.includes('reenviado')) return 'text-emerald-600'
  // Mensajes informativos (registro pendiente)
  if (msg.includes('Regístrate') || msg.includes('Confirma tu contraseña')) return 'text-gray-500'
  // Mensajes de error
  return 'text-red-500'
})

function resetErrors() {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.general = ''
}

function validateLogin(): boolean {
  resetErrors()
  if (!email.value) { errors.email = 'El correo es obligatorio'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { errors.email = 'Correo no válido'; return false }
  if (!password.value) { errors.password = 'La contraseña es obligatoria'; return false }
  if (password.value.length < 6) { errors.password = 'Mínimo 6 caracteres'; return false }
  return true
}

function validateRegister(): boolean {
  resetErrors()
  if (!email.value) { errors.email = 'El correo es obligatorio'; return false }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { errors.email = 'Correo no válido'; return false }
  if (!password.value) { errors.password = 'La contraseña es obligatoria'; return false }
  if (password.value.length < 6) { errors.password = 'Mínimo 6 caracteres'; return false }
  if (!confirmPassword.value) { errors.confirmPassword = 'Confirma la contraseña'; return false }
  if (password.value !== confirmPassword.value) { errors.confirmPassword = 'Las contraseñas no coinciden'; return false }
  return true
}

async function handleSubmit() {
  if (needsConfirmPassword.value) {
    if (!validateRegister()) return
  } else {
    if (!validateLogin()) return
  }

  loading.value = true
  errors.general = ''

  try {
    if (needsConfirmPassword.value) {
      // Registro
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) {
        if (error.message?.toLowerCase().includes('rate limit')) {
          errors.general = '⏳ Límite de envíos alcanzado. Espera un momento e inténtalo de nuevo.'
        } else {
          errors.general = error.message
        }
        return
      }
      if (data?.user?.identities?.length === 0) {
        errors.general = 'Este correo ya está registrado.'
        needsConfirmPassword.value = false
        return
      }
      // Registro exitoso
      if (!data?.session) {
        await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        })
      }
      window.location.href = '/'
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) {
        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          // El usuario no existe o contraseña incorrecta → mostrar confirmar contraseña para registro
          needsConfirmPassword.value = true
          showPassword.value = true
          showConfirmPassword.value = true
          errors.general = 'Regístrate para obtener una cuenta.'
          nextTick(() => confirmInputRef.value?.focus())
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          errors.general = 'Correo no confirmado. Reenviando...'
          await resendConfirmation()
        } else {
          errors.general = error.message
        }
        return
      }
      // Login exitoso
      window.location.href = '/'
    }
  } catch (e: any) {
    errors.general = e?.message || 'Error inesperado'
  } finally {
    loading.value = false
  }
}

async function handleForgotPassword() {
  if (!email.value) {
    errors.general = 'Ingresa tu correo primero.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.general = 'Correo no válido.'
    return
  }
  loading.value = true
  errors.general = ''
  const { error } = await supabase.auth.resetPasswordForEmail(email.value)
  if (error) {
    errors.general = error.message
  } else {
    errors.general = '✅ Revisa tu correo para restablecer la contraseña.'
  }
  loading.value = false
}

async function resendConfirmation() {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.value,
  })
  if (error) {
    errors.general = 'Error al reenviar: ' + error.message
  } else {
    errors.general = '✅ Correo de confirmación reenviado. Revisa tu bandeja de entrada.'
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
