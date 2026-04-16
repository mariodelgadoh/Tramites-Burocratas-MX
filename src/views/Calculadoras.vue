<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
    <Navbar />
    
    <div class="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      <h1 class="text-3xl font-bold text-secondary-900 mb-8 flex items-center">
        <svg class="w-8 h-8 mr-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        Calculadoras Útiles
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Calculadora de IVA -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary-900">Calculadora de IVA</h2>
              <p class="text-secondary-500 text-sm">Calcula el 16% de IVA</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Monto sin IVA</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input
                  v-model.number="iva.cantidad"
                  type="number"
                  @input="calcularIVA"
                  class="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="bg-blue-50 rounded-xl p-4">
                <p class="text-sm text-blue-600 mb-1">IVA (16%)</p>
                <p class="text-2xl font-bold text-blue-700">${{ iva.monto }}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-4">
                <p class="text-sm text-green-600 mb-1">Total con IVA</p>
                <p class="text-2xl font-bold text-green-700">${{ iva.total }}</p>
              </div>
            </div>

            <div class="bg-secondary-50 rounded-lg p-3">
              <p class="text-xs text-secondary-600 text-center">
                💡 Fórmula: Monto × 1.16 = Total con IVA
              </p>
            </div>
          </div>
        </div>

        <!-- Calculadora de ISR Simplificada -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary-900">Calculadora de ISR</h2>
              <p class="text-secondary-500 text-sm">Estimación simplificada</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Ingreso mensual (MXN)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input
                  v-model.number="isr.ingreso"
                  type="number"
                  @input="calcularISR"
                  class="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div class="bg-purple-50 rounded-xl p-4">
              <p class="text-sm text-purple-600 mb-1">ISR estimado mensual</p>
              <p class="text-2xl font-bold text-purple-700">${{ isr.monto }}</p>
            </div>

            <div class="bg-amber-50 rounded-lg p-3">
              <p class="text-xs text-amber-700 text-center">
                ⚠️ Esta es una calculadora simplificada basada en tarifas aproximadas.<br>
                Para cálculos oficiales, consulta con un contador.
              </p>
            </div>
          </div>
        </div>

        <!-- Calculadora de Interés Simple -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary-900">Interés Simple</h2>
              <p class="text-secondary-500 text-sm">Calcula intereses</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Capital inicial</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input
                  v-model.number="interes.capital"
                  type="number"
                  @input="calcularInteres"
                  class="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Tasa de interés anual (%)</label>
              <input
                v-model.number="interes.tasa"
                type="number"
                @input="calcularInteres"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="10"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Tiempo (años)</label>
              <input
                v-model.number="interes.tiempo"
                type="number"
                @input="calcularInteres"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4">
              <div class="bg-green-50 rounded-xl p-4">
                <p class="text-sm text-green-600 mb-1">Interés generado</p>
                <p class="text-xl font-bold text-green-700">${{ interes.interesGenerado }}</p>
              </div>
              <div class="bg-blue-50 rounded-xl p-4">
                <p class="text-sm text-blue-600 mb-1">Monto total</p>
                <p class="text-xl font-bold text-blue-700">${{ interes.total }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Calculadora de Porcentajes -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary-900">Calculadora de Porcentaje</h2>
              <p class="text-secondary-500 text-sm">¿Qué porcentaje es un número de otro?</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Número parcial</label>
              <input
                v-model.number="porcentaje.parcial"
                type="number"
                @input="calcularPorcentaje"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: 25"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Número total</label>
              <input
                v-model.number="porcentaje.total"
                type="number"
                @input="calcularPorcentaje"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Ej: 200"
              />
            </div>

            <div class="bg-orange-50 rounded-xl p-4">
              <p class="text-sm text-orange-600 mb-1">Resultado</p>
              <p class="text-2xl font-bold text-orange-700">{{ porcentaje.resultado }}%</p>
              <p class="text-xs text-orange-600 mt-2">
                {{ porcentaje.parcial }} es el {{ porcentaje.resultado }}% de {{ porcentaje.total }}
              </p>
            </div>
          </div>
        </div>

        <!-- Calculadora de Crédito Hipotecario -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary-900">Crédito Hipotecario</h2>
              <p class="text-secondary-500 text-sm">Calcula tu pago mensual</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Monto del préstamo</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input
                  v-model.number="hipoteca.monto"
                  type="number"
                  @input="calcularHipoteca"
                  class="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Tasa de interés anual (%)</label>
              <input
                v-model.number="hipoteca.tasa"
                type="number"
                @input="calcularHipoteca"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="10.5"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Plazo (años)</label>
              <input
                v-model.number="hipoteca.plazo"
                type="number"
                @input="calcularHipoteca"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                placeholder="20"
              />
            </div>

            <div class="bg-indigo-50 rounded-xl p-4">
              <p class="text-sm text-indigo-600 mb-1">Pago mensual estimado</p>
              <p class="text-2xl font-bold text-indigo-700">${{ hipoteca.pagoMensual }}</p>
              <p class="text-xs text-indigo-600 mt-2">Total a pagar: ${{ hipoteca.totalPagar }}</p>
            </div>
          </div>
        </div>

        <!-- Calculadora de Ahorro -->
        <div class="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-secondary-900">Ahorro Programado</h2>
              <p class="text-secondary-500 text-sm">¿Cuánto tendrás al final?</p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Ahorro mensual</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input
                  v-model.number="ahorro.mensual"
                  type="number"
                  @input="calcularAhorro"
                  class="w-full pl-8 pr-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="1,000"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Tasa de interés anual (%)</label>
              <input
                v-model.number="ahorro.tasa"
                type="number"
                @input="calcularAhorro"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="8"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 mb-2">Plazo (años)</label>
              <input
                v-model.number="ahorro.plazo"
                type="number"
                @input="calcularAhorro"
                class="w-full px-4 py-3 border border-secondary-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                placeholder="5"
              />
            </div>

            <div class="bg-emerald-50 rounded-xl p-4">
              <p class="text-sm text-emerald-600 mb-1">Total ahorrado al final</p>
              <p class="text-2xl font-bold text-emerald-700">${{ ahorro.total }}</p>
              <p class="text-xs text-emerald-600 mt-2">Aportaciones: ${{ ahorro.aportaciones }} | Intereses: ${{ ahorro.intereses }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de referencia de ISR -->
      <div class="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-secondary-100">
        <h3 class="text-lg font-bold text-secondary-900 mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Tabla de Referencia - Tasas ISR Simplificadas
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-secondary-50">
              <tr>
                <th class="px-4 py-2 text-left text-secondary-700">Ingreso mensual</th>
                <th class="px-4 py-2 text-left text-secondary-700">Tasa ISR aproximada</th>
                <th class="px-4 py-2 text-left text-secondary-700">ISR estimado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-secondary-100">
              <tr v-for="row in tablaISR" :key="row.rango" class="hover:bg-secondary-50">
                <td class="px-4 py-2 text-secondary-600">{{ row.rango }}</td>
                <td class="px-4 py-2 text-secondary-600">{{ row.tasa }}</td>
                <td class="px-4 py-2 text-secondary-600">{{ row.isr }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'

// IVA Calculator
const iva = reactive({
  cantidad: 0,
  monto: '0.00',
  total: '0.00'
})

const calcularIVA = () => {
  const cantidad = iva.cantidad || 0
  const ivaMonto = cantidad * 0.16
  iva.monto = ivaMonto.toFixed(2)
  iva.total = (cantidad + ivaMonto).toFixed(2)
}

// ISR Calculator
const isr = reactive({
  ingreso: 0,
  monto: '0.00'
})

const calcularISR = () => {
  let ingreso = isr.ingreso || 0
  let tasa = 0
  
  if (ingreso <= 10000) tasa = 0
  else if (ingreso <= 20000) tasa = 0.10
  else if (ingreso <= 35000) tasa = 0.15
  else if (ingreso <= 50000) tasa = 0.20
  else if (ingreso <= 75000) tasa = 0.25
  else tasa = 0.30
  
  isr.monto = (ingreso * tasa).toFixed(2)
}

// Interés Simple
const interes = reactive({
  capital: 0,
  tasa: 0,
  tiempo: 0,
  interesGenerado: '0.00',
  total: '0.00'
})

const calcularInteres = () => {
  const capital = interes.capital || 0
  const tasa = (interes.tasa || 0) / 100
  const tiempo = interes.tiempo || 0
  
  const interesGenerado = capital * tasa * tiempo
  interes.interesGenerado = interesGenerado.toFixed(2)
  interes.total = (capital + interesGenerado).toFixed(2)
}

// Porcentaje
const porcentaje = reactive({
  parcial: 0,
  total: 0,
  resultado: '0.00'
})

const calcularPorcentaje = () => {
  const parcial = porcentaje.parcial || 0
  const total = porcentaje.total || 0
  
  if (total === 0) {
    porcentaje.resultado = '0.00'
  } else {
    porcentaje.resultado = ((parcial / total) * 100).toFixed(2)
  }
}

// Hipoteca
const hipoteca = reactive({
  monto: 0,
  tasa: 0,
  plazo: 0,
  pagoMensual: '0.00',
  totalPagar: '0.00'
})

const calcularHipoteca = () => {
  const monto = hipoteca.monto || 0
  const tasaAnual = (hipoteca.tasa || 0) / 100
  const plazoAnios = hipoteca.plazo || 0
  
  if (monto === 0 || tasaAnual === 0 || plazoAnios === 0) {
    hipoteca.pagoMensual = '0.00'
    hipoteca.totalPagar = '0.00'
    return
  }
  
  const tasaMensual = tasaAnual / 12
  const numPagos = plazoAnios * 12
  
  const pago = monto * (tasaMensual * Math.pow(1 + tasaMensual, numPagos)) / (Math.pow(1 + tasaMensual, numPagos) - 1)
  hipoteca.pagoMensual = pago.toFixed(2)
  hipoteca.totalPagar = (pago * numPagos).toFixed(2)
}

// Ahorro
const ahorro = reactive({
  mensual: 0,
  tasa: 0,
  plazo: 0,
  total: '0.00',
  aportaciones: '0.00',
  intereses: '0.00'
})

const calcularAhorro = () => {
  const mensual = ahorro.mensual || 0
  const tasaAnual = (ahorro.tasa || 0) / 100
  const plazoAnios = ahorro.plazo || 0
  
  if (mensual === 0 || plazoAnios === 0) {
    ahorro.total = '0.00'
    ahorro.aportaciones = '0.00'
    ahorro.intereses = '0.00'
    return
  }
  
  const numPagos = plazoAnios * 12
  const tasaMensual = tasaAnual / 12
  
  const total = mensual * ((Math.pow(1 + tasaMensual, numPagos) - 1) / tasaMensual)
  const aportaciones = mensual * numPagos
  const intereses = total - aportaciones
  
  ahorro.total = total.toFixed(2)
  ahorro.aportaciones = aportaciones.toFixed(2)
  ahorro.intereses = intereses.toFixed(2)
}

// Tabla de referencia ISR
const tablaISR = [
  { rango: '$0 - $10,000', tasa: '0%', isr: '$0' },
  { rango: '$10,001 - $20,000', tasa: '10%', isr: '$1,000 - $2,000' },
  { rango: '$20,001 - $35,000', tasa: '15%', isr: '$3,000 - $5,250' },
  { rango: '$35,001 - $50,000', tasa: '20%', isr: '$7,000 - $10,000' },
  { rango: '$50,001 - $75,000', tasa: '25%', isr: '$12,500 - $18,750' },
  { rango: '$75,001+', tasa: '30%', isr: '$22,500+' }
]
</script>