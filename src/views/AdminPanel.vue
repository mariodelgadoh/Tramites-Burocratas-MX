<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
    <Navbar />

    <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      <!-- Loading state -->
      <div v-if="cargando" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p class="text-gray-600 mt-4">Cargando panel de administración...</p>
      </div>

      <!-- Acceso denegado -->
      <div v-else-if="!authStore.isAdmin()" class="text-center py-12">
        <svg class="w-20 h-20 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h2 class="text-2xl font-bold text-secondary-800 mb-2">Acceso Denegado</h2>
        <p class="text-secondary-600">No tienes permisos para acceder a esta página</p>
        <router-link to="/" class="mt-4 inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600">
          Volver al inicio
        </router-link>
      </div>

      <!-- Panel de Administración -->
      <div v-else>
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-secondary-900">Panel de Administración</h1>
          <p class="text-secondary-600 mt-1">Gestiona usuarios, trámites y estadísticas</p>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-secondary-200 mb-6 overflow-x-auto">
          <button 
            @click="tabActual = 'estadisticas'"
            :class="['px-4 py-2 font-medium transition-colors whitespace-nowrap', tabActual === 'estadisticas' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-500 hover:text-secondary-700']"
          >
            📊 Estadísticas
          </button>
          <button 
            @click="tabActual = 'usuarios'"
            :class="['px-4 py-2 font-medium transition-colors whitespace-nowrap', tabActual === 'usuarios' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-500 hover:text-secondary-700']"
          >
            👥 Usuarios ({{ usuarios.length }})
          </button>
          <button 
            @click="tabActual = 'tramites'"
            :class="['px-4 py-2 font-medium transition-colors whitespace-nowrap', tabActual === 'tramites' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-500 hover:text-secondary-700']"
          >
            📋 Trámites ({{ tramites.length }})
          </button>
          <button 
            @click="tabActual = 'nuevo-tramite'"
            :class="['px-4 py-2 font-medium transition-colors whitespace-nowrap', tabActual === 'nuevo-tramite' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-secondary-500 hover:text-secondary-700']"
          >
            ➕ Nuevo Trámite
          </button>
        </div>

        <!-- Tab: Estadísticas -->
        <div v-if="tabActual === 'estadisticas'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-secondary-500 text-sm">Total Usuarios</p>
                  <p class="text-3xl font-bold text-secondary-900">{{ estadisticas.totalUsuarios }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-secondary-500 text-sm">Total Trámites</p>
                  <p class="text-3xl font-bold text-secondary-900">{{ estadisticas.totalTramites }}</p>
                </div>
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-secondary-500 text-sm">Trámites en Curso</p>
                  <p class="text-3xl font-bold text-secondary-900">{{ estadisticas.tramitesEnCurso }}</p>
                </div>
                <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-secondary-500 text-sm">Trámites Finalizados</p>
                  <p class="text-3xl font-bold text-secondary-900">{{ estadisticas.tramitesFinalizados }}</p>
                </div>
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
            <h3 class="text-lg font-bold text-secondary-900 mb-4">Trámites por Institución</h3>
            <div class="space-y-3">
              <div v-for="inst in estadisticas.tramitesPorInstitucion" :key="inst.institucion" class="flex items-center">
                <span class="w-32 text-sm text-secondary-600 truncate">{{ inst.institucion }}</span>
                <div class="flex-1 ml-4">
                  <div class="bg-blue-100 rounded-full h-6 overflow-hidden">
                    <div class="bg-blue-600 h-6 rounded-full flex items-center justify-end px-2" :style="{ width: (inst.cantidad / Math.max(...estadisticas.tramitesPorInstitucion.map(i => i.cantidad)) * 100) + '%' }">
                      <span class="text-white text-xs font-medium">{{ inst.cantidad }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Usuarios -->
        <div v-if="tabActual === 'usuarios'" class="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Rol</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Trámites</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-secondary-100">
                <tr v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-secondary-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{{ usuario.nombre_completo || 'Sin nombre' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{{ usuario.estado || 'No especificado' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <select 
                      v-model="usuario.rol" 
                      @change="cambiarRol(usuario.id, usuario.rol)"
                      :disabled="usuario.id === authStore.user?.id"
                      class="text-xs px-2 py-1 rounded-full border"
                      :class="usuario.rol === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-800 border-gray-200'"
                    >
                      <option value="usuario">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{{ usuario.total_tramites || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      v-if="usuario.id !== authStore.user?.id"
                      @click="eliminarUsuario(usuario.id, usuario.nombre_completo)" 
                      class="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Eliminar
                    </button>
                    <span v-else class="text-gray-400 text-xs">Tú</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab: Trámites -->
        <div v-if="tabActual === 'tramites'" class="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Institución</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Costo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-secondary-100">
                <tr v-for="tramite in tramites" :key="tramite.id" class="hover:bg-secondary-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{{ tramite.id }}</td>
                  <td class="px-6 py-4 text-sm text-secondary-900">{{ tramite.nombre }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{{ tramite.institucion }}</td>
                  <td class="px-6 py-4 text-sm text-secondary-600">{{ tramite.json_instrucciones?.costo || 'N/A' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button @click="editarTramite(tramite)" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                    <button @click="eliminarTramite(tramite.id)" class="text-red-600 hover:text-red-800">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab: Nuevo Trámite -->
        <div v-if="tabActual === 'nuevo-tramite'" class="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
          <h3 class="text-lg font-bold text-secondary-900 mb-4">Agregar Nuevo Trámite</h3>
          
          <form @submit.prevent="agregarTramite" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Nombre del trámite *</label>
                <input v-model="nuevoTramite.nombre" type="text" required class="w-full px-3 py-2 border rounded-lg">
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Institución *</label>
                <input v-model="nuevoTramite.institucion" type="text" required class="w-full px-3 py-2 border rounded-lg">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">Descripción</label>
              <textarea v-model="nuevoTramite.descripcion" rows="2" class="w-full px-3 py-2 border rounded-lg"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Tiempo estimado</label>
                <input v-model="nuevoTramite.tiempo_estimado" type="text" class="w-full px-3 py-2 border rounded-lg" placeholder="Ej: 3 a 5 días hábiles">
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-1">Costo</label>
                <input v-model="nuevoTramite.costo" type="text" class="w-full px-3 py-2 border rounded-lg" placeholder="Ej: Gratuito o $500 MXN">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">URL oficial (opcional)</label>
              <input v-model="nuevoTramite.url_oficial" type="url" class="w-full px-3 py-2 border rounded-lg">
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">Pasos del trámite (JSON)</label>
              <textarea v-model="nuevoTramite.pasos" rows="6" class="w-full px-3 py-2 border rounded-lg font-mono text-sm"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-1">Tips (separados por coma)</label>
              <input v-model="nuevoTramite.tips" type="text" class="w-full px-3 py-2 border rounded-lg">
            </div>

            <div class="flex gap-3">
              <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Guardar Trámite</button>
              <button type="button" @click="limpiarFormulario" class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Limpiar</button>
            </div>
          </form>

          <div v-if="mensajeExito" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {{ mensajeExito }}
          </div>
          <div v-if="mensajeError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ mensajeError }}
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'

const authStore = useAuthStore()

const tabActual = ref('estadisticas')
const usuarios = ref([])
const tramites = ref([])
const cargando = ref(true)
const estadisticas = ref({
  totalUsuarios: 0,
  totalTramites: 0,
  tramitesEnCurso: 0,
  tramitesFinalizados: 0,
  tramitesPorInstitucion: []
})

const nuevoTramite = ref({
  nombre: '',
  institucion: '',
  descripcion: '',
  tiempo_estimado: '',
  costo: '',
  url_oficial: '',
  pasos: '[{"id":1,"titulo":"Paso 1","checklist":["Requisito 1"]}]',
  tips: ''
})

const mensajeExito = ref('')
const mensajeError = ref('')

// Cargar estadísticas
const cargarEstadisticas = async () => {
  try {
    const { data: perfilesData } = await supabase.from('perfiles').select('id')
    const totalUsuarios = perfilesData?.length || 0
    
    const { count: totalTramites } = await supabase
      .from('tramites_catalogo')
      .select('*', { count: 'exact', head: true })
    
    const { data: progresos } = await supabase
      .from('progreso_usuario')
      .select('estado')
    
    const tramitesEnCurso = progresos?.filter(p => p.estado === 'en_curso').length || 0
    const tramitesFinalizados = progresos?.filter(p => p.estado === 'finalizado').length || 0
    
    const { data: tramitesData } = await supabase
      .from('tramites_catalogo')
      .select('institucion')
    
    const institucionCount = {}
    tramitesData?.forEach(t => {
      institucionCount[t.institucion] = (institucionCount[t.institucion] || 0) + 1
    })
    
    const tramitesPorInstitucion = Object.entries(institucionCount).map(([institucion, cantidad]) => ({
      institucion,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad)
    
    estadisticas.value = {
      totalUsuarios,
      totalTramites: totalTramites || 0,
      tramitesEnCurso,
      tramitesFinalizados,
      tramitesPorInstitucion
    }
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

// Cargar usuarios - VERSIÓN DE DEPURACIÓN
const cargarUsuarios = async () => {
  try {
    console.log('Iniciando carga de usuarios...')
    
    // Obtener perfiles existentes
    const { data: perfiles, error: perfilesError } = await supabase
      .from('perfiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (perfilesError) {
      console.error('Error al cargar perfiles:', perfilesError)
      throw perfilesError
    }

    console.log('Perfiles encontrados:', perfiles?.length)
    console.log('Datos de perfiles:', perfiles)

    if (!perfiles || perfiles.length === 0) {
      usuarios.value = []
      estadisticas.value.totalUsuarios = 0
      return
    }

    const usuariosConDatos = []
    
    for (const perfil of perfiles) {
      console.log('Procesando perfil:', perfil.id, perfil.nombre_completo)
      
      const { count: totalTramites, error: countError } = await supabase
        .from('progreso_usuario')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', perfil.id)

      if (countError) {
        console.error('Error contando trámites para', perfil.id, countError)
      }

      usuariosConDatos.push({
        id: perfil.id,
        nombre_completo: perfil.nombre_completo || 'Sin nombre',
        estado: perfil.estado || 'No especificado',
        rol: perfil.rol || 'usuario',
        total_tramites: totalTramites || 0
      })
    }

    usuarios.value = usuariosConDatos
    estadisticas.value.totalUsuarios = usuariosConDatos.length
    
    console.log('Usuarios cargados correctamente:', usuarios.value.length)
    console.log('Datos de usuarios:', usuarios.value)
    
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    usuarios.value = []
  }
}

// Cambiar rol de usuario
const cambiarRol = async (userId, nuevoRol) => {
  try {
    const { error } = await supabase
      .from('perfiles')
      .update({ rol: nuevoRol })
      .eq('id', userId)
    
    if (error) throw error
    
    alert(`Rol actualizado a ${nuevoRol === 'admin' ? 'Administrador' : 'Usuario'}`)
    await cargarUsuarios()
    await cargarEstadisticas()
  } catch (error) {
    alert('Error al cambiar rol: ' + error.message)
    await cargarUsuarios()
  }
}

// Eliminar usuario
const eliminarUsuario = async (userId, nombre) => {
  if (!confirm(`¿Estás seguro de eliminar al usuario "${nombre}"? Esta acción no se puede deshacer.`)) return
  
  try {
    await supabase.from('progreso_usuario').delete().eq('usuario_id', userId)
    await supabase.from('perfiles').delete().eq('id', userId)
    
    alert(`Usuario "${nombre}" eliminado correctamente`)
    await cargarUsuarios()
    await cargarEstadisticas()
  } catch (error) {
    alert('Error al eliminar usuario: ' + error.message)
  }
}

// Cargar trámites
const cargarTramites = async () => {
  try {
    const { data, error } = await supabase
      .from('tramites_catalogo')
      .select('*')
      .order('id')
    
    if (error) throw error
    tramites.value = data || []
  } catch (error) {
    console.error('Error cargando trámites:', error)
  }
}

// Agregar trámite
const agregarTramite = async () => {
  mensajeExito.value = ''
  mensajeError.value = ''
  
  try {
    let pasosArray = []
    try {
      pasosArray = JSON.parse(nuevoTramite.value.pasos)
    } catch {
      pasosArray = [{"id":1,"titulo":"Paso 1","checklist":["Requisito 1"]}]
    }
    
    const tipsArray = nuevoTramite.value.tips ? nuevoTramite.value.tips.split(',').map(t => t.trim()) : []
    
    const jsonInstrucciones = {
      pasos: pasosArray,
      tiempo_estimado: nuevoTramite.value.tiempo_estimado || 'No especificado',
      costo: nuevoTramite.value.costo || 'No especificado',
      tips: tipsArray
    }
    
    if (nuevoTramite.value.url_oficial) {
      jsonInstrucciones.url_oficial = nuevoTramite.value.url_oficial
    }
    
    const { error } = await supabase
      .from('tramites_catalogo')
      .insert({
        nombre: nuevoTramite.value.nombre,
        institucion: nuevoTramite.value.institucion,
        descripcion: nuevoTramite.value.descripcion,
        json_instrucciones: jsonInstrucciones
      })
    
    if (error) throw error
    
    mensajeExito.value = 'Trámite agregado correctamente'
    limpiarFormulario()
    await cargarTramites()
    await cargarEstadisticas()
    
    setTimeout(() => {
      mensajeExito.value = ''
    }, 3000)
  } catch (error) {
    mensajeError.value = error.message || 'Error al agregar trámite'
    setTimeout(() => {
      mensajeError.value = ''
    }, 3000)
  }
}

// Editar trámite
const editarTramite = (tramite) => {
  alert(`Editar trámite: ${tramite.nombre}\nEsta funcionalidad estará disponible pronto.`)
}

// Eliminar trámite
const eliminarTramite = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este trámite?')) return
  
  try {
    const { error } = await supabase
      .from('tramites_catalogo')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    await cargarTramites()
    await cargarEstadisticas()
    alert('Trámite eliminado correctamente')
  } catch (error) {
    alert('Error al eliminar: ' + error.message)
  }
}

const limpiarFormulario = () => {
  nuevoTramite.value = {
    nombre: '',
    institucion: '',
    descripcion: '',
    tiempo_estimado: '',
    costo: '',
    url_oficial: '',
    pasos: '[{"id":1,"titulo":"Paso 1","checklist":["Requisito 1"]}]',
    tips: ''
  }
}

// Cargar todos los datos
const cargarTodosLosDatos = async () => {
  cargando.value = true
  try {
    await cargarEstadisticas()
    await cargarUsuarios()
    await cargarTramites()
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(async () => {
  await authStore.init()
  
  if (authStore.isAdmin()) {
    await cargarTodosLosDatos()
  } else {
    cargando.value = false
  }
})
</script>