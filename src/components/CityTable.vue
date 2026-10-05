<script setup lang="ts">
import { number, state } from '../state'
</script>
<template>
  <section class="panel">
    <div class="panel-heading"><h2>Precios por terminal</h2><span class="badge neutral">€/m³</span></div>
    <p v-if="state.summary.value?.stale" class="warning-text">Datos incompletos o desactualizados.</p>
    <div class="table-scroll"><table><thead><tr><th>Terminal</th><th>GOA</th><th>GOA+</th>
      <th>Gna95</th><th>Gna95+</th><th>Gna98</th></tr></thead>
      <tbody><tr v-for="city in state.summary.value?.cities" :key="city.city">
        <td><strong>{{ city.city }}</strong><small>{{ city.reference }}</small></td>
        <td>{{ number(city.goa, 4) }}</td><td>{{ number(city.goaPlus, 4) }}</td>
        <td>{{ number(city.gasoline95) }}</td><td>{{ number(city.gasoline95Plus) }}</td>
        <td>{{ number(city.gasoline98) }}</td>
      </tr></tbody></table></div>
    <p v-if="!state.summary.value?.cities.length" class="empty">
      Faltan cotizaciones, cierre o primas para calcular los precios.</p>
  </section>
</template>
