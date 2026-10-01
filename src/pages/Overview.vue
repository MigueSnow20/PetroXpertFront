<script setup lang="ts">
import MarketCards from '../components/MarketCards.vue'
import ExternalChart from '../components/ExternalChart.vue'
import CityTable from '../components/CityTable.vue'
import { age, date, number, state } from '../state'
</script>
<template>
  <MarketCards />
  <div class="dashboard-grid">
    <div class="stack">
      <ExternalChart title="London Gas Oil" pair="8861" />
      <ExternalChart title="Gasolina RBOB" pair="954867" />
    </div>
    <div class="stack">
      <section class="panel"><div class="panel-heading"><h2>Variaciones</h2></div>
        <p class="tiny muted">Frente al último cierre manual</p>
        <div class="variation"><span>Gasóleo NWE</span>
          <strong>{{ number(state.summary.value?.variations?.gasoilChange) }}
            <span class="value-unit">€/m³</span></strong></div>
        <div class="variation"><span>Gasolina</span>
          <strong>{{ number(state.summary.value?.variations?.gasolineChange) }}
            <span class="value-unit">€/m³</span></strong></div>
        <p v-if="!state.summary.value?.variations" class="empty">Pendiente de cotizaciones y cierre.</p>
        <p v-else-if="state.summary.value.stale" class="warning-text">Calculado con entradas desactualizadas.</p>
      </section>
      <section class="panel"><div class="panel-heading"><h2>Último cierre</h2>
        <RouterLink to="/closings">Ver →</RouterLink></div>
        <template v-if="state.summary.value?.closing.data">
          <p class="muted">{{ date(state.summary.value.closing.data.recordedAt) }}</p>
          <div class="variation"><span>ICE Gasóleo</span>
            <strong>{{ number(state.summary.value.closing.data.values.ice) }}</strong></div>
          <div class="variation"><span>EUR/USD</span>
            <strong>{{ number(state.summary.value.closing.data.values.divisa, 4) }}</strong></div>
        </template><p v-else class="empty">No hay un cierre disponible.</p>
        <p class="tiny muted">{{ state.summary.value?.closing.status }} ·
          {{ age(state.summary.value?.closing.fetchedAt ?? null) }}</p>
      </section>
      <section class="panel"><div class="panel-heading"><h2>Informe diario</h2>
        <RouterLink to="/reports">Ver →</RouterLink></div>
        <p class="report-preview">{{ state.summary.value?.reports.data?.[0]?.text ?? 'No hay informe disponible.' }}</p>
        <p class="tiny muted">{{ date(state.summary.value?.reports.data?.[0]?.recordedAt) }}</p>
        <p v-if="state.summary.value?.reports.status !== 'OK'" class="warning-text tiny">
          {{ state.summary.value?.reports.message ?? 'Esperando informe' }}</p>
      </section>
      <section class="panel"><h2>Alertas de disponibilidad</h2>
        <p v-if="!state.degraded.value" class="success-text">Las fuentes están respondiendo.</p>
        <p v-for="market in state.summary.value?.markets.filter(m => m.stale || m.sourceStatus !== 'OK')"
          :key="market.code" class="alert-item">{{ market.name }}:
          {{ market.price === null ? 'Datos temporalmente no disponibles'
            : market.sourceStatus === 'ERROR' ? 'No se ha podido actualizar la cotización'
            : 'Cotización desactualizada' }}</p>
        <p v-if="state.summary.value?.closing.status !== 'OK'" class="alert-item">Cierres:
          {{ state.summary.value?.closing.message ?? 'Sin datos' }}</p>
        <p v-if="state.summary.value?.premiums.status !== 'OK'" class="alert-item">Primas:
          {{ state.summary.value?.premiums.message ?? 'Sin datos' }}</p>
      </section>
    </div>
  </div>
  <CityTable />
</template>
