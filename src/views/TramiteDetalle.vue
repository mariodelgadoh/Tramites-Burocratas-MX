<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
    <Navbar />
    
    <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div v-if="cargando" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p class="text-gray-600 mt-4">Cargando trámite...</p>
      </div>
      
      <div v-else-if="tramite" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Notificación de éxito -->
        <div v-if="mensajeExito" class="fixed top-20 right-4 z-50 animate-slide-in">
          <div class="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{{ mensajeExito }}</span>
          </div>
        </div>

        <!-- Notificación de error -->
        <div v-if="mensajeError" class="fixed top-20 right-4 z-50 animate-slide-in">
          <div class="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ mensajeError }}</span>
          </div>
        </div>

        <!-- Notificación de finalización -->
        <div v-if="mensajeFinalizado" class="fixed top-20 right-4 z-50 animate-slide-in">
          <div class="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ mensajeFinalizado }}</span>
          </div>
        </div>

        <!-- Encabezado -->
        <div class="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold">{{ tramite.nombre }}</h1>
              <p class="text-primary-100 mt-1">{{ tramite.institucion }}</p>
            </div>
            <button 
              @click="descargarPDF"
              class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Descargar PDF
            </button>
          </div>
        </div>

        <div class="p-6">
          <!-- Descripción -->
          <p class="text-gray-600 mb-6">{{ tramite.descripcion }}</p>

          <!-- URL oficial -->
          <div v-if="instrucciones.url_oficial" class="bg-primary-50 p-4 rounded-lg mb-6">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              <span class="font-semibold text-primary-800">Trámite en línea:</span>
              <a :href="instrucciones.url_oficial" target="_blank" class="text-primary-600 hover:underline break-all">
                {{ instrucciones.url_oficial }}
              </a>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-secondary-50 p-4 rounded-lg mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-semibold">Tiempo estimado:</span>
                <span class="ml-2">{{ instrucciones.tiempo_estimado }}</span>
              </div>
              <div>
                <span class="font-semibold">Costo:</span>
                <span class="ml-2">{{ instrucciones.costo }}</span>
              </div>
            </div>
          </div>

          <!-- Progreso general -->
          <div class="mb-6">
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium">Progreso general</span>
              <span class="text-sm font-medium">{{ porcentajeProgreso }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-primary-600 h-3 rounded-full transition-all duration-300"
                :style="{ width: porcentajeProgreso + '%' }"
              ></div>
            </div>
          </div>

          <!-- Pasos del trámite -->
          <div class="space-y-4">
            <div 
              v-for="(paso, index) in instrucciones.pasos" 
              :key="paso.id"
              class="border rounded-lg p-4 transition-all duration-300"
              :class="{ 'bg-green-50 border-green-300': pasoCompletado(paso.id) }"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-bold text-lg">
                    Paso {{ index + 1 }}: {{ paso.titulo }}
                  </h3>
                  
                  <div class="mt-3 space-y-2">
                    <div 
                      v-for="(item, itemIndex) in paso.checklist"
                      :key="itemIndex"
                      class="flex items-center group hover:bg-gray-50 p-1 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        :id="`${paso.id}-${itemIndex}`"
                        :checked="itemCompletado(paso.id, item)"
                        @change="toggleItem(paso.id, item)"
                        class="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                        :disabled="esFinalizado"
                      />
                      <label :for="`${paso.id}-${itemIndex}`" class="text-gray-700 cursor-pointer flex-1" :class="{ 'line-through text-gray-400': esFinalizado }">
                        {{ item }}
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="ml-4">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all',
                    pasoCompletado(paso.id) ? 'bg-green-600' : 'bg-gray-400'
                  ]">
                    {{ pasoCompletado(paso.id) ? '✓' : index + 1 }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div v-if="instrucciones.tips && instrucciones.tips.length > 0" class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 class="font-bold text-yellow-800 mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Tips importantes
            </h4>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(tip, index) in instrucciones.tips" :key="index" class="text-yellow-700">
                {{ tip }}
              </li>
            </ul>
          </div>

          <!-- Botones de acción -->
          <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <!-- Si está finalizado, mostrar opción de reiniciar -->
            <template v-if="esFinalizado">
              <button 
                @click="reiniciarTramite"
                class="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Reiniciar trámite
              </button>
              <button 
                @click="volverAlDashboard"
                class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Volver al dashboard
              </button>
            </template>
            
            <!-- Si está en curso -->
            <template v-else>
              <button 
                @click="guardarProgresoYRedirigir"
                class="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Guardar progreso y salir
              </button>
              
              <button 
                v-if="todosCompletados"
                @click="finalizarTramite"
                class="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Marcar como finalizado
              </button>
              
              <button 
                @click="volverAlDashboard"
                class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
              >
                Volver sin guardar
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { useTramiteStore } from '../stores/tramiteStore'
import { generarPDFTramite } from '../utils/pdfGenerator'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const tramiteStore = useTramiteStore()

const tramite = ref(null)
const instrucciones = ref({ pasos: [] })
const progresoActual = ref([])
const cargando = ref(true)
const mensajeExito = ref('')
const mensajeError = ref('')
const mensajeFinalizado = ref('')
let timeoutExito = null
let timeoutError = null
let timeoutFinalizado = null

const pasosCompletados = computed(() => {
  return progresoActual.value || []
})

const porcentajeProgreso = computed(() => {
  const totalItems = instrucciones.value.pasos.reduce((total, paso) => total + paso.checklist.length, 0)
  if (totalItems === 0) return 0
  return Math.round((pasosCompletados.value.length / totalItems) * 100)
})

const todosCompletados = computed(() => {
  const totalItems = instrucciones.value.pasos.reduce((total, paso) => total + paso.checklist.length, 0)
  return pasosCompletados.value.length === totalItems && totalItems > 0
})

const esFinalizado = computed(() => {
  const progresoExistente = tramiteStore.miProgreso.find(p => p.tramite_id === tramite.value?.id)
  return progresoExistente?.estado === 'finalizado'
})

const pasoCompletado = (pasoId) => {
  const paso = instrucciones.value.pasos.find(p => p.id === pasoId)
  if (!paso) return false
  
  return paso.checklist.every(item => itemCompletado(pasoId, item))
}

const itemCompletado = (pasoId, item) => {
  const key = `${pasoId}-${item}`
  return pasosCompletados.value.includes(key)
}

const toggleItem = (pasoId, item) => {
  if (esFinalizado.value) return
  
  const key = `${pasoId}-${item}`
  const index = progresoActual.value.indexOf(key)
  
  if (index === -1) {
    progresoActual.value.push(key)
  } else {
    progresoActual.value.splice(index, 1)
  }
  
  guardarProgreso()
}

const guardarProgreso = async () => {
  if (!authStore.user || !tramite.value) return
  
  const estado = todosCompletados.value ? 'finalizado' : 'en_curso'
  
  await tramiteStore.guardarProgreso(
    authStore.user.id,
    tramite.value.id,
    progresoActual.value,
    estado
  )
}

const guardarProgresoYRedirigir = async () => {
  if (!authStore.user || !tramite.value) return
  
  const completados = progresoActual.value.length
  
  if (completados === 0) {
    mensajeError.value = 'No se puede guardar el progreso sin completar ningún requisito. Marca al menos un requisito para guardar.'
    
    if (timeoutError) clearTimeout(timeoutError)
    timeoutError = setTimeout(() => {
      mensajeError.value = ''
    }, 3000)
    return
  }
  
  const estado = todosCompletados.value ? 'finalizado' : 'en_curso'
  
  await tramiteStore.guardarProgreso(
    authStore.user.id,
    tramite.value.id,
    progresoActual.value,
    estado
  )
  
  mensajeExito.value = 'Progreso guardado correctamente'
  
  if (timeoutExito) clearTimeout(timeoutExito)
  
  timeoutExito = setTimeout(() => {
    router.push('/')
  }, 1500)
}

const finalizarTramite = async () => {
  if (!authStore.user || !tramite.value) return
  
  const estado = 'finalizado'
  
  await tramiteStore.guardarProgreso(
    authStore.user.id,
    tramite.value.id,
    progresoActual.value,
    estado
  )
  
  mensajeFinalizado.value = 'Trámite finalizado. Redirigiendo...'
  
  if (timeoutFinalizado) clearTimeout(timeoutFinalizado)
  
  timeoutFinalizado = setTimeout(() => {
    router.push('/')
  }, 1500)
}

// Reiniciar trámite - VERSIÓN DEFINITIVA (recarga la página)
const reiniciarTramite = async () => {
  if (!confirm('¿Estás seguro de que quieres reiniciar este trámite? Se perderá todo tu progreso anterior.')) return
  
  try {
    const progresoExistente = tramiteStore.miProgreso.find(p => p.tramite_id === tramite.value.id)
    
    if (progresoExistente) {
      const { error } = await supabase
        .from('progreso_usuario')
        .delete()
        .eq('id', progresoExistente.id)
      
      if (error) throw error
    }
    
    mensajeExito.value = 'Trámite reiniciado correctamente. Recargando página...'
    
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    
  } catch (error) {
    console.error('Error al reiniciar trámite:', error)
    mensajeError.value = 'Error al reiniciar el trámite: ' + error.message
    setTimeout(() => {
      mensajeError.value = ''
    }, 3000)
  }
}

const volverAlDashboard = () => {
  router.push('/')
}

const descargarPDF = () => {
  const progreso = {
    pasos_completados: progresoActual.value
  }
  
  generarPDFTramite(tramite.value, progreso, authStore.perfil)
}

onMounted(async () => {
  const id = route.params.id
  await tramiteStore.obtenerTramite(id)
  tramite.value = tramiteStore.tramiteActual
  
  if (tramite.value) {
    instrucciones.value = tramite.value.json_instrucciones
    
    const progresoExistente = tramiteStore.miProgreso.find(p => p.tramite_id === tramite.value.id)
    if (progresoExistente) {
      progresoActual.value = progresoExistente.pasos_completados || []
    }
  }
  
  cargando.value = false
})
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.line-through {
  text-decoration: line-through;
}
</style>