import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './util/router.ts'
import store from './store'

const app = createApp(App)

app.use(router)
app.use(store)

store.dispatch('fetchNflOdds')
store.dispatch('fetchAllPlayers')

app.mount('#app');
