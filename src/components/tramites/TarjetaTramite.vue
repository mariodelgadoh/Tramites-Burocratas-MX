<template>
  <div class="tarjeta-moderna">
    <!-- Header con ícono e institución -->
    <div class="tarjeta-header">
      <div class="icono-institucion" :style="{ backgroundColor: colorInstitucion }">
        <span class="icono-texto">{{ tramite.institucion.charAt(0) }}</span>
      </div>
      <div class="header-info">
        <h3 class="nombre-tramite">{{ tramite.nombre }}</h3>
        <span class="institucion-tag">{{ tramite.institucion }}</span>
      </div>
    </div>

    <!-- Descripción -->
    <p class="descripcion-tramite">{{ tramite.descripcion }}</p>
    
    <!-- Precio y tiempo -->
    <div class="info-extra">
      <div class="info-item">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="info-texto">{{ instrucciones?.tiempo_estimado || 'No especificado' }}</span>
      </div>
      <div class="info-item">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="info-texto">{{ instrucciones?.costo || 'Gratuito' }}</span>
      </div>
    </div>

    <!-- URL oficial -->
    <div v-if="tramite.json_instrucciones?.url_oficial" class="url-oficial">
      <a :href="tramite.json_instrucciones.url_oficial" target="_blank" @click.stop>
        🌐 Realizar trámite en línea
      </a>
    </div>

    <!-- Progreso (solo para usuarios logueados) -->
    <div v-if="!publico && progreso" class="progreso-container">
      <div class="barra-progreso">
        <div class="barra-llena" :style="{ width: porcentajeProgreso + '%' }"></div>
      </div>
      <span class="porcentaje-texto">{{ porcentajeProgreso }}% completado</span>
    </div>

    <!-- Estado y botón -->
    <div class="footer-tarjeta">
      <span v-if="!publico && progreso" :class="estadoClass">
        {{ estado === 'en_curso' ? 'En progreso' : 'Finalizado' }}
      </span>
      <span v-else class="estado-disponible">Listo para iniciar</span>
      
      <button class="boton-accion" @click="handleClick">
        {{ textoBoton }}
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tramite: Object,
  progreso: Object,
  publico: Boolean
})

const emit = defineEmits(['iniciar'])

const instrucciones = computed(() => props.tramite.json_instrucciones || {})
const estado = computed(() => props.progreso?.estado || 'en_curso')

// Colores por institución
const colorInstitucion = computed(() => {
  const colores = {
    'SAT': '#10b981',
    'INE': '#3b82f6',
    'SRE': '#8b5cf6',
    'SEP': '#f59e0b',
    'IMSS': '#ef4444',
    'RENAPO': '#06b6d4',
    'IMPI': '#ec4899',
    'Gobierno Federal': '#6b7280',
    'Gobierno Estatal': '#6b7280',
    'Gobierno Municipal': '#6b7280',
    'CONAGUA': '#14b8a6',
    'CONAPRED': '#8b5cf6',
    'Aduanas': '#f97316',
    'Secretaría de la Defensa Nacional': '#4b5563'
  }
  return colores[props.tramite.institucion] || '#6366f1'
})

const totalPasos = computed(() => instrucciones.value?.pasos?.length || 0)
const porcentajeProgreso = computed(() => {
  if (totalPasos.value === 0) return 0
  const completados = props.progreso?.pasos_completados?.length || 0
  return Math.round((completados / totalPasos.value) * 100)
})

const estadoClass = computed(() => 
  estado.value === 'en_curso' ? 'badge-progreso' : 'badge-finalizado'
)

const textoBoton = computed(() => {
  if (props.publico) return 'Comenzar'
  if (estado.value === 'en_curso') return 'Continuar'
  if (porcentajeProgreso.value === 100) return 'Ver resumen'
  return 'Revisar'
})

const handleClick = () => {
  emit('iniciar', props.tramite.id)
}
</script>

<style scoped>
.tarjeta-moderna {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  border: 1px solid #f0f0f0;
}

.tarjeta-moderna:hover {
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

.tarjeta-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.icono-institucion {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icono-texto {
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.header-info {
  flex: 1;
}

.nombre-tramite {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.institucion-tag {
  font-size: 0.7rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
}

.descripcion-tramite {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info-extra {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
}

.info-texto {
  font-size: 0.7rem;
  color: #6b7280;
}

.url-oficial {
  margin: 0.75rem 0;
}

.url-oficial a {
  font-size: 0.7rem;
  color: #3b82f6;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.url-oficial a:hover {
  text-decoration: underline;
}

.progreso-container {
  margin: 0.75rem 0;
}

.barra-progreso {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.barra-llena {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.porcentaje-texto {
  font-size: 0.65rem;
  color: #6b7280;
  display: block;
  margin-top: 0.25rem;
}

.footer-tarjeta {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.badge-progreso {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: #fef3c7;
  color: #92400e;
}

.badge-finalizado {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: #d1fae5;
  color: #065f46;
}

.estado-disponible {
  font-size: 0.7rem;
  color: #9ca3af;
}

.boton-accion {
  display: flex;
  align-items: center;
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.boton-accion:hover {
  background: #2563eb;
  transform: scale(1.02);
}
</style>