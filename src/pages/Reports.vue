<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { api } from '../api'
import { date, state } from '../state'
const text = ref('')
const busy = ref(false)
const message = ref('')
const error = ref('')
let controller: AbortController | undefined
onUnmounted(() => controller?.abort())
async function save() {
  if (busy.value || !text.value.trim()) return
  busy.value = true
  message.value = ''
  error.value = ''
  controller = new AbortController()
  try {
    const result = await api.save('reports', { text: text.value }, controller.signal)
    message.value = result.message
    text.value = ''
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'No se pudo guardar'
  } finally { busy.value = false }
}
</script>
<template>
  <section class="panel">
    <h2>Informe diario</h2>
    <p v-if="state.summary.value?.reports.status !== 'OK'" class="warning-text">
      {{ state.summary.value?.reports.message ?? 'Esperando informes' }}</p>
    <article v-if="state.summary.value?.reports.data?.[0]">
      <p class="report-text">{{ state.summary.value.reports.data[0].text }}</p>
      <p class="muted">{{ date(state.summary.value.reports.data[0].recordedAt) }}</p>
    </article><p v-else class="empty">No hay un informe disponible.</p>
  </section>
  <section class="panel"><h2>Redactar informe</h2>
    <form @submit.prevent="save"><label for="report">Contenido del informe</label>
      <textarea id="report" v-model="text" rows="10" maxlength="50000" required :disabled="busy"></textarea>
      <p v-if="message" class="notice" role="status">{{ message }}</p>
      <p v-if="error" class="notice danger" role="alert">{{ error }}</p>
      <button :disabled="busy || !text.trim()">{{ busy ? 'Guardando…' : 'Guardar informe' }}</button>
    </form>
  </section>
</template>
