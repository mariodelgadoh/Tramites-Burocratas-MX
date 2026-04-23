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
        <!-- Mensaje de verificación -->
        <div v-if="mensajeVerificacion" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl relative">
          <button 
            @click="cerrarMensaje"
            class="absolute top-3 right-3 text-blue-400 hover:text-blue-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div class="flex items-start gap-3 pr-6">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <div>
              <p class="font-semibold text-blue-800">¡Registro exitoso!</p>
              <p class="text-sm text-blue-700 mt-1">{{ mensajeVerificacion }}</p>
              <p class="text-xs text-blue-600 mt-2">✉️ Revisa tu bandeja de entrada y también la carpeta de spam.</p>
              <p class="text-xs text-blue-600 mt-2">🔗 Haz clic en el enlace que te enviamos para activar tu cuenta.</p>
              <p v-if="verificando" class="text-xs text-green-600 mt-2 flex items-center gap-1">
                <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Esperando verificación de correo...
              </p>
              <p v-if="verificacionExitosa" class="text-xs text-green-600 mt-2 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                ✅ ¡Correo verificado! Redirigiendo al inicio de sesión...
              </p>
            </div>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl relative">
          <button 
            @click="errorMessage = ''"
            class="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <p class="text-red-600 text-sm text-center pr-6">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5" v-if="!mensajeVerificacion">
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
            class="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

const email = ref('')
const password = ref('')
const nombreCompleto = ref('')
const estado = ref('')
const cargando = ref(false)
const errorMessage = ref('')
const mensajeVerificacion = ref('')
const verificando = ref(false)
const verificacionExitosa = ref(false)
let pollingInterval = null
let timeoutId = null
const router = useRouter()

const estados = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
  'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla',
  'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora',
  'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
]

// Verificar si el usuario ya confirmó su correo
const verificarConfirmacionCorreo = async () => {
  try {
    // Obtener la sesión actual
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user?.email_confirmed_at) {
      // El correo ya fue verificado
      verificando.value = false
      verificacionExitosa.value = true
      
      // Detener el polling y el timeout
      if (pollingInterval) {
        clearInterval(pollingInterval)
        pollingInterval = null
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      // Refrescar la página después de 2 segundos
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      
      return true
    }
    return false
  } catch (error) {
    console.error('Error verificando correo:', error)
    return false
  }
}

// Iniciar polling para detectar verificación de correo
const iniciarPollingVerificacion = () => {
  verificando.value = true
  
  // Verificar cada 3 segundos
  pollingInterval = setInterval(async () => {
    await verificarConfirmacionCorreo()
  }, 3000)
  
  // Detener después de 5 minutos (300 segundos)
  timeoutId = setTimeout(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    if (verificando.value) {
      verificando.value = false
      errorMessage.value = 'Tiempo de espera agotado. Por favor, verifica tu correo manualmente e inicia sesión.'
    }
  }, 300000)
}

// Cerrar mensaje y limpiar polling
const cerrarMensaje = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  mensajeVerificacion.value = ''
  verificando.value = false
  router.push('/login')
}

const handleRegister = async () => {
  cargando.value = true
  errorMessage.value = ''
  mensajeVerificacion.value = ''
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          nombre_completo: nombreCompleto.value,
          estado: estado.value
        }
      }
    })
    
    if (error) throw error
    
    // Crear perfil en la tabla perfiles
    if (data.user) {
      await supabase
        .from('perfiles')
        .upsert({
          id: data.user.id,
          nombre_completo: nombreCompleto.value,
          estado: estado.value,
          rol: 'usuario'
        })
    }
    
    // Mostrar mensaje de verificación
    mensajeVerificacion.value = `Hemos enviado un enlace de verificación a ${email.value}.`
    
    // Limpiar formulario
    email.value = ''
    password.value = ''
    nombreCompleto.value = ''
    estado.value = ''
    
    // Iniciar polling para detectar verificación
    iniciarPollingVerificacion()
    
  } catch (error) {
    errorMessage.value = error.message || 'Error al registrar usuario'
  } finally {
    cargando.value = false
  }
}

// Limpiar intervalo al desmontar componente
onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>