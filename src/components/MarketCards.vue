<script setup lang="ts">
import { age, number, state } from '../state'
</script>
<template>
  <section class="market-grid" aria-label="Cotizaciones">
    <article v-for="market in state.summary.value?.markets" :key="market.code" class="panel market-card">
      <div class="card-top"><span class="market-icon">{{ market.code === 'EUR_USD' ? '€' : '◈' }}</span>
        <span class="badge" :class="{ warning: market.stale || market.sourceStatus !== 'OK' || state.error.value }">
          {{ state.error.value ? 'Sin conexión' : market.sourceStatus === 'PENDING' ? 'Cargando cotizaciones...'
            : market.price === null ? 'Datos temporalmente no disponibles' : market.stale ? 'Desactualizado'
            : market.sourceStatus === 'ERROR' ? 'Fuente con error' : 'Disponible' }}
        </span>
      </div>
      <h2>{{ market.name }}</h2><span class="muted tiny">Cotización de mercado · {{ market.code }}</span>
      <div class="quote">{{ number(market.price, market.code === 'GASOIL' ? 2 : 4) }}
        <span>{{ market.unit }}</span></div>
      <p class="freshness">{{ age(market.fetchedAt) }}</p>
    </article>
    <template v-if="!state.summary.value">
      <article v-for="label in ['London Gas Oil', 'Gasolina RBOB', 'EUR / USD']"
        :key="label" class="panel market-card"><h2>{{ label }}</h2><div class="quote">—</div>
        <p>{{ state.error.value ? 'Datos temporalmente no disponibles' : 'Cargando cotizaciones...' }}</p></article>
    </template>
  </section>
</template>
