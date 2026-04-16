import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useTramiteStore = defineStore('tramite', {
  state: () => ({
    tramitesCatalogo: [],
    miProgreso: [],
    tramiteActual: null
  }),
  
  actions: {
    async cargarCatalogo() {
      const { data } = await supabase
        .from('tramites_catalogo')
        .select('*')
        .order('nombre')
      
      this.tramitesCatalogo = data || []
      return this.tramitesCatalogo
    },
    
    async cargarMiProgreso(usuarioId) {
      const { data } = await supabase
        .from('progreso_usuario')
        .select('*, tramites_catalogo(*)')
        .eq('usuario_id', usuarioId)
      
      this.miProgreso = data || []
      return this.miProgreso
    },
    
    async obtenerTramite(id) {
      const { data } = await supabase
        .from('tramites_catalogo')
        .select('*')
        .eq('id', id)
        .single()
      
      this.tramiteActual = data
      return data
    },
    
    async guardarProgreso(usuarioId, tramiteId, pasosCompletados, estado) {
      // Verificar si ya existe progreso
      const { data: existente } = await supabase
        .from('progreso_usuario')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('tramite_id', tramiteId)
        .single()
      
      if (existente) {
        // Actualizar
        const { error } = await supabase
          .from('progreso_usuario')
          .update({
            pasos_completados: pasosCompletados,
            estado: estado,
            updated_at: new Date()
          })
          .eq('id', existente.id)
        
        if (error) throw error
      } else {
        // Insertar
        const { error } = await supabase
          .from('progreso_usuario')
          .insert({
            usuario_id: usuarioId,
            tramite_id: tramiteId,
            pasos_completados: pasosCompletados,
            estado: estado
          })
        
        if (error) throw error
      }
      
      await this.cargarMiProgreso(usuarioId)
    }
  }
})