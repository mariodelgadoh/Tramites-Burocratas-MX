import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    perfil: null,
    session: null
  }),
  
  actions: {
    async init() {
      const { data: { session } } = await supabase.auth.getSession()
      this.session = session
      this.user = session?.user || null
      
      if (this.user) {
        await this.cargarPerfil()
      }
    },
    
    async cargarPerfil() {
      if (!this.user) return
      
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', this.user.id)
        .maybeSingle()
      
      if (data) {
        this.perfil = data
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error cargando perfil:', error)
      }
      
      if (!this.perfil && this.user?.user_metadata) {
        this.perfil = {
          nombre_completo: this.user.user_metadata.nombre_completo,
          estado: this.user.user_metadata.estado || 'No especificado',
          rol: 'usuario'
        }
      }
    },
    
    async registrar(email, password, nombreCompleto, estado) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombreCompleto,
            estado: estado,
            rol: 'usuario'
          }
        }
      })
      
      if (error) throw error
      
      this.user = data.user
      this.session = data.session
      
      this.perfil = {
        nombre_completo: nombreCompleto,
        estado: estado,
        rol: 'usuario'
      }
      
      if (data.user) {
        try {
          const { error: perfilError } = await supabase
            .from('perfiles')
            .insert({
              id: data.user.id,
              nombre_completo: nombreCompleto,
              estado: estado,
              rol: 'usuario'
            })
          
          if (perfilError) {
            console.error('Error al crear perfil:', perfilError)
          }
        } catch (e) {
          console.error('Error:', e)
        }
      }
      
      return data
    },
    
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      this.user = data.user
      this.session = data.session
      await this.cargarPerfil()
      return data
    },
    
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.perfil = null
      this.session = null
    },
    
    async recuperarPassword(email) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) throw error
      return true
    },
    
    // Verificar si es administrador
    isAdmin() {
      return this.perfil?.rol === 'admin'
    }
  }
})