import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
// General Font
import 'vfonts/Lato.css'
// Monospace Font
import 'vfonts/FiraCode.css'


const app = createApp(App)
app.use(naive)
app.mount('#app')
