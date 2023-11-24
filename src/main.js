import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

createApp(App).mount('#app')
