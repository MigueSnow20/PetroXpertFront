<script setup lang="ts">
import { onUnmounted, reactive, ref, watch } from 'vue'
import { api } from '../api'
const props = defineProps<{
  title: string
  resource: 'closings' | 'premiums'
  fields: Record<string, string>
  initial?: Readonly<Record<string, number>>
}>()
const values = reactive<Record<string, string | number>>({})
const dirty = ref(false)
const busy = ref(false)
const message = ref('')
const error = ref('')
let controller: AbortController | undefined
watch(() => props.initial, (initial) => {
  if (!dirty.value && initial) Object.assign(values, initial)
}, { immediate: true })
onUnmounted(() => controller?.abort())
async function save() {
  if (busy.value) return
  busy.value = true
  error.value = ''
  message.value = ''
  controller = new AbortController()
  try {
    const result = await api.save(props.resource, values, controller.signal)
    message.value = result.message
    dirty.value = false
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'No se pudo guardar'
  } finally { busy.value = false }
}
</script>
<template>
  <section class="panel">
    <h2>{{ title }}</h2>
    <p class="muted tiny">Cada guardado crea un nuevo registro. Cierres y primas se guardan por separado.</p>
    <form @submit.prevent="save" @input="dirty = true">
      <div class="form-grid"><label v-for="(label, field) in fields" :key="field">{{ label }}
        <input v-model="values[field]" type="number" step="0.0001" required :disabled="busy">
      </label></div>
      <p v-if="message" class="notice" role="status">{{ message }}</p>
      <p v-if="error" class="notice danger" role="alert">{{ error }}</p>
      <button :disabled="busy">{{ busy ? 'Guardando…' : 'Guardar nuevo registro' }}</button>
    </form>
  </section>
</template>
