import { computed, readonly, ref } from 'vue'
import { api } from './api'
import type { Summary } from './types'

const summary = ref<Summary | null>(null)
const error = ref('')
const now = ref(Date.now())
const loading = ref(true)
let poll: ReturnType<typeof setTimeout> | undefined
let clock: ReturnType<typeof setInterval> | undefined
let controller: AbortController | undefined
let active = false
// Offline retry before the first successful response; normal cadence comes from the collector configuration.
let interval = 5000

async function update() {
  controller = new AbortController()
  try {
    summary.value = await api.summary(controller.signal, response => {
      const configuredInterval = Number(response.headers.get('X-Market-Refresh-Ms'))
      if (Number.isFinite(configuredInterval) && configuredInterval > 0) interval = configuredInterval
    })
    error.value = ''
  } catch (cause) {
    if (active) error.value = cause instanceof Error ? cause.message : 'No se pudo conectar con PetroXpert'
  } finally {
    loading.value = false
    if (active) poll = setTimeout(update, interval)
  }
}
export function startPolling() {
  if (active) return
  active = true
  clock = setInterval(() => { now.value = Date.now() }, 1000)
  void update()
}
export function stopPolling() {
  active = false
  clearTimeout(poll)
  clearInterval(clock)
  controller?.abort()
}
export const state = {
  summary: readonly(summary), error: readonly(error), loading: readonly(loading), now: readonly(now),
  degraded: computed(() => !!error.value || !summary.value || summary.value.stale
    || summary.value.markets.some(market => market.sourceStatus !== 'OK')
    || !['OK', 'EMPTY'].includes(summary.value.reports.status)),
}
export function age(date: string | null) {
  if (!date) return 'Sin captura disponible'
  return `Actualizado hace ${Math.max(0, Math.floor((now.value - Date.parse(date)) / 1000))} segundos`
}
export function number(value: number | null | undefined, decimals = 2) {
  return value == null ? '—' : value.toLocaleString('es-ES', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  })
}
export function date(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString('es-ES') : 'Sin fecha disponible'
}
