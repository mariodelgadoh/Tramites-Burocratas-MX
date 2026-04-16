<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Recuperar contraseña
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRecuperar">
        <div class="rounded-md shadow-sm">
          <div>
            <label for="email" class="sr-only">Correo electrónico</label>
            <input
              v-model="email"
              id="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Correo electrónico"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="cargando"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ cargando ? 'Enviando...' : 'Enviar enlace de recuperación' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-500">
            Volver al inicio de sesión
          </router-link>
        </div>

        <div v-if="mensajeExito" class="text-green-600 text-sm text-center">
          {{ mensajeExito }}
        </div>

        <div v-if="errorMessage" class="text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const email = ref('')
const cargando = ref(false)
const errorMessage = ref('')
const mensajeExito = ref('')
const authStore = useAuthStore()

const handleRecuperar = async () => {
  cargando.value = true
  errorMessage.value = ''
  mensajeExito.value = ''
  
  try {
    await authStore.recuperarPassword(email.value)
    mensajeExito.value = 'Te hemos enviado un enlace de recuperación a tu correo electrónico'
    email.value = '' // Limpiar el campo
  } catch (error) {
    errorMessage.value = error.message || 'Error al enviar el enlace de recuperación'
  } finally {
    cargando.value = false
  }
}
</script>