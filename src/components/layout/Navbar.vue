<template>
  <nav class="bg-white/80 backdrop-blur-md border-b border-secondary-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo - Siempre visible -->
        <router-link to="/" class="flex items-center space-x-2 group">
          <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <span class="font-bold text-xl text-secondary-900">Burocracia MX</span>
        </router-link>

        <!-- Desktop Menu - Cambia según autenticación -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Menú para usuarios LOGUEADOS -->
          <template v-if="authStore.user">
            <router-link 
              to="/" 
              class="nav-link"
              :class="{ 'nav-link-active': rutaActiva === '/' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/calculadoras" 
              class="nav-link"
              :class="{ 'nav-link-active': rutaActiva === '/calculadoras' }"
            >
              Calculadoras
            </router-link>
            <router-link 
              v-if="authStore.isAdmin()" 
              to="/admin" 
              class="nav-link"
              :class="{ 'nav-link-active': rutaActiva === '/admin' }"
            >
              👑 Admin
            </router-link>
          </template>
          
          <!-- Menú para usuarios NO LOGUEADOS -->
          <template v-else>
            <span class="text-secondary-500 font-medium flex items-center gap-1">
              <svg class="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Encuentra tu trámite aquí
            </span>
          </template>
        </div>

        <!-- User Menu - Cambia según autenticación -->
        <div class="flex items-center space-x-4">
          <!-- Usuario LOGUEADO -->
          <template v-if="authStore.user">
            <div class="hidden md:flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-bold">
                  {{ authStore.perfil?.nombre_completo?.charAt(0) || 
                     authStore.user?.user_metadata?.nombre_completo?.charAt(0) || 
                     authStore.user?.email?.charAt(0)?.toUpperCase() || 
                     'U' }}
                </span>
              </div>
              <span class="text-sm text-secondary-600">
                {{ authStore.perfil?.nombre_completo || 
                   authStore.user?.user_metadata?.nombre_completo || 
                   authStore.user?.email?.split('@')[0] || 
                   'Usuario' }}
              </span>
            </div>
            
            <button
              @click="cerrarSesion"
              class="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Salir</span>
            </button>
          </template>
          
          <!-- Usuario NO LOGUEADO -->
          <template v-else>
            <router-link
              to="/login"
              class="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              <span>Iniciar sesión</span>
            </router-link>
            
            <router-link
              to="/register"
              class="hidden md:flex items-center space-x-2 px-4 py-2 border border-primary-500 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              <span>Registrarse</span>
            </router-link>
          </template>

          <!-- Mobile menu button - Siempre visible -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-secondary-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu - Cambia según autenticación -->
      <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-secondary-100 animate-slide-up">
        <!-- Usuario LOGUEADO - Menú móvil -->
        <template v-if="authStore.user">
          <div class="flex flex-col space-y-3">
            <router-link 
              to="/" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': rutaActiva === '/' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/calculadoras" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': rutaActiva === '/calculadoras' }"
            >
              Calculadoras
            </router-link>
            <router-link 
              v-if="authStore.isAdmin()" 
              to="/admin" 
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link-active': rutaActiva === '/admin' }"
            >
              👑 Admin
            </router-link>
            <div class="border-t border-secondary-100 my-2"></div>
            <div class="px-2 py-1 text-sm text-secondary-500">
              {{ authStore.perfil?.nombre_completo || 
                 authStore.user?.user_metadata?.nombre_completo || 
                 authStore.user?.email?.split('@')[0] || 
                 'Usuario' }}
            </div>
            <button 
              @click="cerrarSesion"
              class="text-left text-red-600 hover:text-red-700 px-2 py-1"
            >
              Cerrar sesión
            </button>
          </div>
        </template>
        
        <!-- Usuario NO LOGUEADO - Menú móvil -->
        <template v-else>
          <div class="flex flex-col space-y-3">
            <div class="bg-primary-50 rounded-lg p-3 mb-2">
              <p class="text-primary-700 text-sm font-medium">Encuentra tu trámite aquí</p>
              <p class="text-primary-600 text-xs mt-1">Busca y guarda tu progreso</p>
            </div>
            <router-link to="/login" class="text-primary-600 font-medium px-2 py-1">Iniciar sesión</router-link>
            <router-link to="/register" class="text-secondary-600 hover:text-primary-600 px-2 py-1">Registrarse</router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const mobileMenuOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Ruta activa para el subrayado
const rutaActiva = computed(() => route.path)

// Cerrar menú móvil al cambiar de ruta
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const cerrarSesion = async () => {
  await authStore.logout()
  mobileMenuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
/* Estilos para enlaces de navegación desktop */
.nav-link {
  position: relative;
  padding-bottom: 0.25rem;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s ease;
  text-decoration: none;
}

.nav-link:hover {
  color: #0ea5e9;
}

/* Enlace activo con subrayado */
.nav-link-active {
  color: #0ea5e9;
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  border-radius: 2px;
  animation: slideIn 0.3s ease-out;
}

/* Estilos para enlaces móvil */
.mobile-nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #4b5563;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.mobile-nav-link:hover {
  background-color: #f3f4f6;
  color: #0ea5e9;
}

.mobile-nav-link-active {
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  color: #0284c7;
  font-weight: 600;
}

/* Animación del subrayado */
@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100%;
    opacity: 1;
  }
}
</style>