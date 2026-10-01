<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
const props = defineProps<{ title: string; pair: '8861' | '954867' }>()
// URLs supplied and confirmed by the user. Keep them verbatim.
const charts = {
  '8861': 'https://ssltvc.forexprostools.com/?pair_ID=8861&height=450&width=100%&interval=300&plotStyle=candles&domain_ID=4&lang_ID=4&timezone_ID=12',
  '954867': 'https://ssltvc.forexprostools.com/?pair_ID=954867&height=450&width=100%&interval=300&plotStyle=candles&domain_ID=4&lang_ID=4&timezone_ID=12',
}
const chartUrl = computed(() => charts[props.pair])
const chartWindow = ref<HTMLDivElement | null>(null)
const scale = ref(1.2)
let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  resizeObserver = new ResizeObserver(entries => {
    scale.value = Math.min(1.2, entries[0].contentRect.width / 650)
  })
  if (chartWindow.value) resizeObserver.observe(chartWindow.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())
</script>
<template>
  <section class="panel chart-panel">
    <div class="panel-heading"><h2>{{ title }}</h2></div>
    <div ref="chartWindow" class="chart-window" :style="{ '--chart-scale': scale }">
      <iframe :src="chartUrl" :title="`Gráfico de ${title}`" referrerpolicy="no-referrer"></iframe>
    </div>
  </section>
</template>
