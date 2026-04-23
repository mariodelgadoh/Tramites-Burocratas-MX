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
            <div class="tarjeta-dashboard">
              <div class="tarjeta-header">
                <h3 class="tarjeta-titulo">{{ tramite.tramites_catalogo.nombre }}</h3>
                <p class="tarjeta-institucion">{{ tramite.tramites_catalogo.institucion }}</p>
              </div>
              
              <p class="tarjeta-descripcion">{{ tramite.tramites_catalogo.descripcion }}</p>
              
              <!-- Barra de progreso -->
              <div class="progreso-container">
                <div class="progreso-header">
                  <span class="progreso-label">Progreso</span>
                  <span class="progreso-porcentaje">{{ calcularPorcentaje(tramite) }}%</span>
                </div>
                <div class="progreso-barra">
                  <div class="progreso-barra-llena" :style="{ width: calcularPorcentaje(tramite) + '%' }"></div>
                </div>
                <p class="progreso-detalle">
                  {{ tramite.pasos_completados?.length || 0 }} de {{ totalPasos(tramite) }} requisitos completados
                </p>
              </div>
              
              <div class="tarjeta-footer">
                <span class="estado-badge estado-curso">En curso</span>
                <button 
                  @click="handleIniciarTramite(tramite.tramites_catalogo.id)" 
                  class="btn-continuar"
                >
                  Continuar
                </button>
              </div>
            </div>
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
            <div class="tarjeta-dashboard">
              <div class="tarjeta-header">
                <h3 class="tarjeta-titulo">{{ tramite.tramites_catalogo.nombre }}</h3>
                <p class="tarjeta-institucion">{{ tramite.tramites_catalogo.institucion }}</p>
              </div>
              
              <p class="tarjeta-descripcion">{{ tramite.tramites_catalogo.descripcion }}</p>
              
              <!-- Barra de progreso completada -->
              <div class="progreso-container">
                <div class="progreso-header">
                  <span class="progreso-label">Progreso</span>
                  <span class="progreso-porcentaje">100%</span>
                </div>
                <div class="progreso-barra">
                  <div class="progreso-barra-llena completa" style="width: 100%"></div>
                </div>
                <p class="progreso-detalle">
                  {{ tramite.pasos_completados?.length || 0 }} de {{ totalPasos(tramite) }} requisitos completados
                </p>
              </div>
              
              <div class="tarjeta-footer">
                <span class="estado-badge estado-finalizado">Finalizado</span>
                <button 
                  @click="handleIniciarTramite(tramite.tramites_catalogo.id)" 
                  class="btn-ver"
                >
                  Ver detalles
                </button>
              </div>
            </div>
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

const router = useRouter()
const authStore = useAuthStore()
const tramiteStore = useTramiteStore()

const tramitesEnCurso = computed(() => 
  tramiteStore.miProgreso.filter(p => p.estado === 'en_curso')
)

const tramitesFinalizados = computed(() => 
  tramiteStore.miProgreso.filter(p => p.estado === 'finalizado')
)

// Calcular total de pasos de un trámite
const totalPasos = (tramite) => {
  const instrucciones = tramite.tramites_catalogo?.json_instrucciones
  return instrucciones?.pasos?.reduce((total, paso) => total + paso.checklist.length, 0) || 0
}

// Calcular porcentaje de progreso
const calcularPorcentaje = (tramite) => {
  const total = totalPasos(tramite)
  if (total === 0) return 0
  const completados = tramite.pasos_completados?.length || 0
  return Math.round((completados / total) * 100)
}

const handleIniciarTramite = (tramiteId) => {
  router.push(`/tramite/${tramiteId}`)
}

const irALogin = () => {
  router.push('/login')
}

onMounted(async () => {
  await tramiteStore.cargarCatalogo()
  
  if (authStore.user) {
    await tramiteStore.cargarMiProgreso(authStore.user.id)
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.grid-item {
  height: 100%;
}

/* Tarjeta Dashboard */
.tarjeta-dashboard {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.tarjeta-dashboard:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.tarjeta-header {
  margin-bottom: 0.5rem;
}

.tarjeta-titulo {
  font-weight: bold;
  font-size: 1rem;
  color: #1f2937;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tarjeta-institucion {
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.tarjeta-descripcion {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

/* Barra de progreso */
.progreso-container {
  margin: 0.75rem 0;
}

.progreso-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.progreso-label {
  font-size: 0.7rem;
  color: #6b7280;
}

.progreso-porcentaje {
  font-size: 0.7rem;
  font-weight: 600;
  color: #0ea5e9;
}

.progreso-barra {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progreso-barra-llena {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progreso-barra-llena.completa {
  background: linear-gradient(90deg, #10b981, #059669);
}

.progreso-detalle {
  font-size: 0.65rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

/* Footer de tarjeta */
.tarjeta-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.estado-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.estado-curso {
  background-color: #fef3c7;
  color: #92400e;
}

.estado-finalizado {
  background-color: #d1fae5;
  color: #065f46;
}

.btn-continuar, .btn-ver {
  background-color: #0ea5e9;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.7rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-continuar:hover, .btn-ver:hover {
  background-color: #0284c7;
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