<script setup lang="ts">
import CityTable from '../components/CityTable.vue'
import NumericForm from '../components/NumericForm.vue'
import { state } from '../state'
const fields = {
  gasoilVigo: 'Gasóleo Vigo', gasolinaFirstVigo: 'Gasolina 1ª Vigo', gasolinaSecondVigo: 'Gasolina 2ª Vigo',
  gasoilHuelva: 'Gasóleo Huelva', gasolinaFirstHuelva: 'Gasolina 1ª Huelva',
  gasolinaSecondHuelva: 'Gasolina 2ª Huelva', gasoilMerida: 'Gasóleo Mérida',
}
</script>
<template>
  <CityTable />
  <p class="notice">{{ state.summary.value?.premiums.status ?? 'PENDING' }} ·
    {{ state.summary.value?.premiums.message ?? 'Primas manuales utilizadas por el cálculo' }}</p>
  <NumericForm title="Primas por ciudad" resource="premiums" :fields="fields"
    :initial="state.summary.value?.premiums.data?.values" />
</template>
