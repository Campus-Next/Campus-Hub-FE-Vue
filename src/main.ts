import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/global.css'
import 'animate.css'
import 'remixicon/fonts/remixicon.css'
import { vAnimate } from './directives/vAnimate'

const app = createApp(App)

app.use(router)

app.directive('animate', vAnimate)

app.mount('#app')
