<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { startPolling, state, stopPolling } from './state'
const route = useRoute()
const clock = computed(() => new Date(state.now.value).toLocaleString('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit',
}))
const links = [['/', '◫', 'Dashboard'], ['/markets', '↗', 'Mercados'], ['/closings', '▤', 'Cierres'],
  ['/reports', '▧', 'Informes'], ['/cities', '⌖', 'Ciudades']]
onMounted(startPolling)
onUnmounted(stopPolling)
</script>
<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand"><img src="/logo.png" alt="PetroXpert" class="brand-logo" /></RouterLink>
    <div class="nav-caption">WORKSPACE</div>
    <nav aria-label="Navegación principal">
      <RouterLink v-for="[path, icon, label] in links" :key="path" :to="path">
        <span class="nav-icon">{{ icon }}</span>{{ label }}
      </RouterLink>
    </nav>
    <div class="sidebar-foot"><span class="dot"></span> PetroXpert<br><small>Inteligencia de mercado</small></div>
  </aside>
  <div class="workspace">
    <header class="topbar">
      <span>Workspace <span class="muted">/ {{ route.meta.title }}</span></span>
      <time>{{ clock }}</time>
      <span class="badge" :class="{ warning: state.degraded.value }">
        <span class="dot"></span>{{ state.degraded.value ? 'Disponibilidad parcial' : 'Actualización activa' }}
      </span>
    </header>
    <main>
      <div class="page-heading"><div><div class="eyebrow">PETROXPERT · ENERGY MARKETS</div>
        <h1>{{ route.meta.title }}</h1></div>
      </div>
      <div v-if="state.error.value" class="notice danger" role="alert">
        Conexión interrumpida: {{ state.error.value }}. Los datos anteriores pueden estar desactualizados.
      </div>
      <div v-if="state.loading.value" class="notice" role="status">Conectando con PetroXpert…</div>
      <RouterView />
      <footer>PetroXpert · Datos con procedencia y fecha de captura. Captura frecuente no implica tiempo real.</footer>
    </main>
  </div>
</template>
