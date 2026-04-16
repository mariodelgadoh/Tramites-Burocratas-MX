<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full animate-fade-in">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-secondary-900 mb-2">Crear cuenta</h1>
        <p class="text-secondary-600">Únete y simplifica tus trámites</p>
      </div>

      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-secondary-100">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Nombre completo</label>
            <input
              v-model="nombreCompleto"
              type="text"
              required
              class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Juan Pérez García"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Contraseña</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Estado</label>
            <select
              v-model="estado"
              required
              class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none bg-white"
            >
              <option value="">Selecciona tu estado</option>
              <option v-for="est in estados" :key="est" :value="est">{{ est }}</option>
            </select>
          </div>

          <button
            type="submit"
            :disabled="cargando"
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50"
          >
            {{ cargando ? 'Creando cuenta...' : 'Registrarse' }}
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-secondary-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-secondary-500">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <router-link
            to="/login"
            class="block w-full text-center py-3 rounded-xl font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            Iniciar sesión
          </router-link>
        </form>

        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const email = ref('')
const password = ref('')
const nombreCompleto = ref('')
const estado = ref('')
const cargando = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const estados = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
  'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

const handleRegister = async () => {
  cargando.value = true
  errorMessage.value = ''
  
  try {
    await authStore.registrar(email.value, password.value, nombreCompleto.value, estado.value)
    
    // Verificar si hay un trámite pendiente después del registro
    const tramitePendiente = sessionStorage.getItem('tramitePendiente')
    if (tramitePendiente) {
      sessionStorage.removeItem('tramitePendiente')
      router.push(`/tramite/${tramitePendiente}`)
    } else {
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al registrar usuario'
  } finally {
    cargando.value = false
  }
}
</script>