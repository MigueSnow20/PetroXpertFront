<script setup lang="ts">
import MarketCards from '../components/MarketCards.vue'
import ExternalChart from '../components/ExternalChart.vue'
import { date, state } from '../state'
function sourceName(source: string) {
  try { return new URL(source).hostname } catch { return 'Sin fuente' }
}
</script>
<template>
  <MarketCards />
  <section class="panel"><h2>Estado de las fuentes</h2>
    <div class="table-scroll"><table><thead><tr><th>Mercado</th><th>Capturado</th><th>Observado en origen</th>
      <th>Estado</th><th>Próximo intento previsto</th></tr></thead>
      <tbody><tr v-for="market in state.summary.value?.markets" :key="market.code">
        <td>{{ market.name }}<small>{{ sourceName(market.source) }}</small></td>
        <td>{{ date(market.fetchedAt) }}</td>
        <td>{{ market.observedAt ? date(market.observedAt) : 'No disponible' }}</td>
        <td>{{ market.sourceStatus }}</td><td>{{ date(market.nextAttemptAt) }}</td>
      </tr></tbody></table></div>
    <p class="tiny muted">La captura mide cuándo se consultó el precio, no la hora de la operación de mercado.</p>
  </section>
  <ExternalChart title="London Gas Oil" pair="8861" />
  <ExternalChart title="Gasolina RBOB" pair="954867" />
</template>
