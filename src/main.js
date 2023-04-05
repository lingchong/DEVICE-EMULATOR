import { createApp } from 'vue'
import Terminal from 'vue-web-terminal'

import App from './App.vue'


const app = createApp(App)
app.use(Terminal)
app.mount('#app')
// app.config.globalProperties.$mybus = new mitt()
