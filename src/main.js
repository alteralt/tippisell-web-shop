import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import FloatingVue from "floating-vue"
import LoadScript from "vue-plugin-load-script"
import * as Sentry from "@sentry/vue"

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

if (import.meta.env.VITE_SENTRY_DSN != undefined) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            new Sentry.BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            }),
            new Sentry.Replay(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    })
}

app.use(router)
app.use(LoadScript)
app.use(FloatingVue)
app.mount("#app")
