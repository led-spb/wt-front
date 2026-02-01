import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuestic } from 'vuestic-ui'
import "vuestic-ui/css"
import "material-design-icons-iconfont/dist/material-design-icons.min.css";

import App from '@/App.vue'
import router from '@/router'

// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'

const app = createApp(App)

app.use(createPinia())
// app.use(createVuetify({
//   components,
//   directives,
// }))
app.use(createVuestic({
    config: {
        colors: {
            currentPresetName: JSON.parse(localStorage.getItem('darkMode') || 'false') ? 'dark' : 'light'
        }
    }
}))
app.use(router)

app.mount('#app')
