import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Overview from './pages/Overview.vue'
import Markets from './pages/Markets.vue'
import Closings from './pages/Closings.vue'
import Reports from './pages/Reports.vue'
import Cities from './pages/Cities.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Overview, meta: { title: 'Dashboard' } },
    { path: '/markets', component: Markets, meta: { title: 'Mercados' } },
    { path: '/closings', component: Closings, meta: { title: 'Cierres' } },
    { path: '/reports', component: Reports, meta: { title: 'Informes' } },
    { path: '/cities', component: Cities, meta: { title: 'Ciudades' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
createApp(App).use(router).mount('#app')
