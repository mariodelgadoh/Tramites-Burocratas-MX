<template>
  <div class="buscador-container">
    <!-- Buscador y filtros -->
    <div class="buscador-filtros">
      <div class="input-buscador">
        <svg class="input-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre o institución..."
          class="input-texto"
        />
      </div>
      
      <select v-model="institucion" class="select-filtro">
        <option value="">Todas las instituciones</option>
        <option v-for="inst in instituciones" :key="inst" :value="inst">
          {{ inst }}
        </option>
      </select>
    </div>
    
    <!-- Resultados -->
    <div v-if="tramitesFiltrados.length > 0" class="grid-resultados">
      <div v-for="tramite in tramitesFiltrados" :key="tramite.id" class="grid-item">
        <div class="tarjeta-resultado">
          <!-- Header -->
          <div class="tarjeta-header">
            <div class="icono-institucion" :style="{ backgroundColor: getColorInstitucion(tramite.institucion) }">
              <span class="icono-texto">{{ tramite.institucion.charAt(0) }}</span>
            </div>
            <div class="header-info">
              <h3 class="titulo-tramite">{{ tramite.nombre }}</h3>
              <span class="tag-institucion">{{ tramite.institucion }}</span>
            </div>
          </div>

          <!-- Descripción -->
          <p class="descripcion-tramite">{{ tramite.descripcion }}</p>
          
          <!-- Precio y tiempo -->
          <div class="info-extra">
            <div class="info-item">
              <svg class="info-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="info-texto">{{ tramite.json_instrucciones?.tiempo_estimado || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <svg class="info-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="info-texto">{{ tramite.json_instrucciones?.costo || 'Gratuito' }}</span>
            </div>
          </div>

          <!-- URL oficial -->
          <div v-if="tramite.json_instrucciones?.url_oficial" class="url-container">
            <a :href="tramite.json_instrucciones.url_oficial" target="_blank" class="url-enlace" @click.stop>
              🌐 Realizar trámite en línea
            </a>
          </div>

          <!-- Botón -->
          <div class="boton-container">
            <button class="boton-iniciar" @click.stop="irATramite(tramite.id)">
              Iniciar trámite
              <svg class="boton-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sin resultados -->
    <div v-else-if="busqueda || institucion" class="vacio-container">
      <svg class="vacio-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="vacio-texto">No se encontraron trámites</p>
      <p class="vacio-subtexto">Intenta con otros términos de búsqueda</p>
    </div>
    
    <!-- Estado inicial -->
    <div v-else class="inicio-container">
      <svg class="inicio-icono" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <p class="inicio-texto">Escribe algo para buscar trámites</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTramiteStore } from '../../stores/tramiteStore'

const emit = defineEmits(['iniciar-tramite'])

const busqueda = ref('')
const institucion = ref('')
const tramiteStore = useTramiteStore()

const instituciones = computed(() => {
  const inst = new Set(tramiteStore.tramitesCatalogo.map(t => t.institucion))
  return Array.from(inst).sort()
})

const tramitesFiltrados = computed(() => {
  let filtrados = tramiteStore.tramitesCatalogo
  
  if (busqueda.value) {
    const busquedaLower = busqueda.value.toLowerCase()
    filtrados = filtrados.filter(t => 
      t.nombre.toLowerCase().includes(busquedaLower) ||
      t.descripcion.toLowerCase().includes(busquedaLower) ||
      t.institucion.toLowerCase().includes(busquedaLower)
    )
  }
  
  if (institucion.value) {
    filtrados = filtrados.filter(t => t.institucion === institucion.value)
  }
  
  return filtrados
})

const getColorInstitucion = (institucion) => {
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
  return colores[institucion] || '#6366f1'
}

const irATramite = (id) => {
  emit('iniciar-tramite', id)
}

onMounted(() => {
  tramiteStore.cargarCatalogo()
})
</script>

<style scoped>
/* Contenedor principal */
.buscador-container {
  width: 100%;
}

/* Filtros de búsqueda */
.buscador-filtros {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .buscador-filtros {
    flex-direction: row;
  }
}

.input-buscador {
  flex: 1;
  position: relative;
}

.input-icono {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.input-texto {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.2s;
}

.input-texto:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
}

.select-filtro {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  outline: none;
  cursor: pointer;
}

.select-filtro:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
}

/* Grid de resultados */
.grid-resultados {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid-resultados {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-resultados {
    grid-template-columns: repeat(3, 1fr);
  }
}

.grid-item {
  height: 100%;
}

/* Tarjeta de resultado */
.tarjeta-resultado {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 1rem;
  padding: 1.25rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
}

.tarjeta-resultado:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

/* Header de tarjeta */
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

.titulo-tramite {
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tag-institucion {
  font-size: 0.7rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
}

/* Descripción */
.descripcion-tramite {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Info extra */
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
}

.info-icono {
  width: 0.875rem;
  height: 0.875rem;
  color: #9ca3af;
}

.info-texto {
  font-size: 0.7rem;
  color: #6b7280;
}

/* URL */
.url-container {
  margin: 0.75rem 0;
}

.url-enlace {
  font-size: 0.7rem;
  color: #3b82f6;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.url-enlace:hover {
  text-decoration: underline;
}

/* Botón - SIEMPRE ALINEADO AL FONDO */
.boton-container {
  margin-top: auto;
  padding-top: 0.75rem;
}

.boton-iniciar {
  width: 100%;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.boton-iniciar:hover {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  transform: scale(1.02);
}

.boton-icono {
  width: 1rem;
  height: 1rem;
}

/* Estados vacíos */
.vacio-container {
  text-align: center;
  padding: 3rem 0;
}

.vacio-icono {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 0.75rem;
  color: #d1d5db;
}

.vacio-texto {
  color: #6b7280;
  font-size: 0.875rem;
}

.vacio-subtexto {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.inicio-container {
  text-align: center;
  padding: 2rem 0;
}

.inicio-icono {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 0.75rem;
  color: #d1d5db;
}

.inicio-texto {
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>