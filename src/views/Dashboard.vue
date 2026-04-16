<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
    <Navbar />
    
    <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      <!-- Welcome Banner Moderno para usuario logueado -->
      <div v-if="authStore.user" class="banner-bienvenida">
        <div class="banner-contenido">
          <div class="banner-texto">
            <h1 class="banner-titulo">
              ¡Bienvenido, {{ authStore.perfil?.nombre_completo || authStore.user?.user_metadata?.nombre_completo || authStore.user?.email?.split('@')[0] || 'Usuario' }}!
            </h1>
            <p class="banner-subtitulo">Gestiona tus trámites de manera sencilla y rápida</p>
          </div>
          <div class="banner-icono">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div v-else class="banner-invitacion">
        <div class="banner-contenido">
          <div class="banner-texto">
            <h1 class="banner-titulo">¡Bienvenido a Burocracia MX!</h1>
            <p class="banner-subtitulo">Inicia sesión para guardar tu progreso y gestionar tus trámites</p>
            <button @click="irALogin" class="boton-iniciar">
              Iniciar sesión
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
          <div class="banner-icono">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Buscador de trámites -->
      <div class="card-buscador">
        <div class="card-header">
          <svg class="card-header-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <h2 class="card-header-titulo">Buscar trámites</h2>
        </div>
        <Buscador @iniciar-tramite="handleIniciarTramite" />
      </div>

      <!-- Trámites en curso (solo para usuarios logueados) -->
      <div v-if="authStore.user && tramitesEnCurso.length > 0" class="card-seccion">
        <div class="seccion-header">
          <div class="seccion-titulo">
            <span class="seccion-icono">📋</span>
            <h2 class="seccion-texto">Trámites en curso</h2>
          </div>
          <span class="seccion-badge-activo">{{ tramitesEnCurso.length }} activos</span>
        </div>
        
        <div class="grid-tarjetas">
          <div v-for="tramite in tramitesEnCurso" :key="tramite.id" class="grid-item">
            <TarjetaTramite 
              :tramite="tramite.tramites_catalogo"
              :progreso="tramite"
              :publico="false"
              @iniciar="handleIniciarTramite"
            />
          </div>
        </div>
      </div>

      <!-- Trámites finalizados (solo para usuarios logueados) -->
      <div v-if="authStore.user && tramitesFinalizados.length > 0" class="card-seccion">
        <div class="seccion-header">
          <div class="seccion-titulo">
            <span class="seccion-icono">✅</span>
            <h2 class="seccion-texto">Trámites finalizados</h2>
          </div>
          <span class="seccion-badge-completado">{{ tramitesFinalizados.length }} completados</span>
        </div>
        
        <div class="grid-tarjetas">
          <div v-for="tramite in tramitesFinalizados" :key="tramite.id" class="grid-item">
            <TarjetaTramite 
              :tramite="tramite.tramites_catalogo"
              :progreso="tramite"
              :publico="false"
              @iniciar="handleIniciarTramite"
            />
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay trámites (solo para usuarios logueados) -->
      <div v-if="authStore.user && tramitesEnCurso.length === 0 && tramitesFinalizados.length === 0" class="card-vacio">
        <svg class="icono-vacio" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="texto-vacio-titulo">No tienes trámites aún</h3>
        <p class="texto-vacio-subtitulo">Busca un trámite arriba y comienza a guardar tu progreso</p>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useTramiteStore } from '../stores/tramiteStore'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import Buscador from '../components/tramites/Buscador.vue'
import TarjetaTramite from '../components/tramites/TarjetaTramite.vue'

const router = useRouter()
const authStore = useAuthStore()
const tramiteStore = useTramiteStore()

const tramites = ref([])

const tramitesEnCurso = computed(() => 
  tramiteStore.miProgreso.filter(p => p.estado === 'en_curso')
)

const tramitesFinalizados = computed(() => 
  tramiteStore.miProgreso.filter(p => p.estado === 'finalizado')
)

const handleIniciarTramite = (tramiteId) => {
  if (!authStore.user) {
    // Guardar el ID del trámite en sessionStorage para recuperarlo después del login
    sessionStorage.setItem('tramitePendiente', tramiteId)
    router.push('/login')
  } else {
    router.push(`/tramite/${tramiteId}`)
  }
}

const irALogin = () => {
  router.push('/login')
}

onMounted(async () => {
  await tramiteStore.cargarCatalogo()
  tramites.value = tramiteStore.tramitesCatalogo
  
  if (authStore.user) {
    await tramiteStore.cargarMiProgreso(authStore.user.id)
    
    // Verificar si hay un trámite pendiente después del login
    const tramitePendiente = sessionStorage.getItem('tramitePendiente')
    if (tramitePendiente) {
      sessionStorage.removeItem('tramitePendiente')
      router.push(`/tramite/${tramitePendiente}`)
    }
  }
})
</script>

<style scoped>
/* Banner de bienvenida para usuario logueado */
.banner-bienvenida {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Banner de invitación para usuario no logueado */
.banner-invitacion {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.banner-contenido {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.banner-texto {
  flex: 1;
}

.banner-titulo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .banner-titulo {
    font-size: 1.875rem;
  }
}

.banner-subtitulo {
  font-size: 0.875rem;
  opacity: 0.9;
}

.banner-icono {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem;
  border-radius: 1rem;
  display: none;
}

@media (min-width: 640px) {
  .banner-icono {
    display: block;
  }
}

.boton-iniciar {
  margin-top: 1rem;
  background: white;
  color: #4b5563;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.boton-iniciar:hover {
  background: #f3f4f6;
  transform: scale(1.02);
}

/* Tarjeta del buscador */
.card-buscador {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-header-icono {
  width: 1.25rem;
  height: 1.25rem;
  color: #0ea5e9;
}

.card-header-titulo {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
}

/* Secciones de trámites */
.card-seccion {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.seccion-titulo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.seccion-icono {
  font-size: 1.25rem;
}

.seccion-texto {
  font-size: 1.125rem;
  font-weight: bold;
  color: #1f2937;
}

.seccion-badge-activo {
  font-size: 0.75rem;
  background: #eff6ff;
  color: #0ea5e9;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.seccion-badge-completado {
  font-size: 0.75rem;
  background: #ecfdf5;
  color: #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

/* Grid de tarjetas */
.grid-tarjetas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.grid-item {
  height: 100%;
}

/* Card vacío */
.card-vacio {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}

.icono-vacio {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1rem;
  color: #d1d5db;
}

.texto-vacio-titulo {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.texto-vacio-subtitulo {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>