import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import TramiteDetalle from '../views/TramiteDetalle.vue'
import Calculadoras from '../views/Calculadoras.vue'
import AdminPanel from '../views/AdminPanel.vue'
import Login from '../components/auth/Login.vue'
import Register from '../components/auth/Register.vue'
import ForgotPassword from '../components/auth/ForgotPassword.vue'
import { supabase } from '../lib/supabase'

const routes = [
  { 
    path: '/', 
    name: 'Dashboard',
    component: Dashboard
  },
  { 
    path: '/login', 
    component: Login, 
    meta: { requiresGuest: true } 
  },
  { 
    path: '/register', 
    component: Register, 
    meta: { requiresGuest: true } 
  },
  { 
    path: '/forgot-password', 
    component: ForgotPassword, 
    meta: { requiresGuest: true } 
  },
  { 
    path: '/tramite/:id', 
    component: TramiteDetalle, 
    meta: { requiresAuth: true }
  },
  { 
    path: '/calculadoras', 
    component: Calculadoras, 
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin', 
    component: AdminPanel, 
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach(async (to, from) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  // Si la ruta requiere autenticación y no hay sesión
  if (to.meta.requiresAuth && !session) {
    return '/login'
  }
  
  // Si la ruta es para invitados (login/register) y ya hay sesión, ir al dashboard
  if (to.meta.requiresGuest && session) {
    return '/'
  }
  
  return true
})

export default router