<script setup lang="ts">
import NumericForm from '../components/NumericForm.vue'
import { date, number, state } from '../state'
const fields = {
  ice: 'ICE Gasóleo', deltaMed: 'Delta MED', deltaNWE: 'Delta NWE', divisa: 'Divisa EUR/USD',
  gna: 'GNA', gnaNWE: 'GNA NWE', gnaMED: 'GNA MED',
}
</script>
<template>
  <section class="panel">
    <div class="panel-heading"><h2>Último cierre registrado</h2>
      <span class="badge neutral">{{ state.summary.value?.closing.status ?? 'PENDING' }}</span></div>
    <p>{{ date(state.summary.value?.closing.data?.recordedAt) }}</p>
    <dl v-if="state.summary.value?.closing.data" class="value-grid">
      <div v-for="(label, field) in fields" :key="field"><dt>{{ label }}</dt>
        <dd>{{ number(state.summary.value.closing.data.values[field], 4) }}</dd></div>
    </dl>
    <p v-else class="empty">No hay un cierre disponible.</p>
    <p class="warning-text">{{ state.summary.value?.closing.message }}</p>
    <p class="tiny muted">El prototipo solo permite consultar el último cierre, sin historial.</p>
  </section>
  <NumericForm title="Registrar cierre" resource="closings" :fields="fields"
    :initial="state.summary.value?.closing.data?.values" />
</template>
