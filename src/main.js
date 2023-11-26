import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import FloatingVue from "floating-vue"
import LoadScript from "vue-plugin-load-script"

import Index from "./views/Index.vue"
import Rules from "./views/Rules.vue"

const router = createRouter({
    routes: [
        {
            path: "/",
            component: Index,
            props: true,
        },
        {
            path: "/rules",
            component: Rules,
            props: true,
        },
    ],
    history: createWebHistory(),
})

const app = createApp(App)
app.use(router)
app.use(LoadScript)
app.use(FloatingVue)
app.mount("#app")
