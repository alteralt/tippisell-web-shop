import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxt/icon",
        "floating-vue/nuxt",
        "@sentry/nuxt/module",
    ],

    sourcemap: { client: process.env.SENTRY_AUTH_TOKEN ? "hidden" : false },

    sentry: {
        telemetry: false,
        sourcemaps: {
            disable: !process.env.SENTRY_AUTH_TOKEN,
            filesToDeleteAfterUpload: ["dist/**/*.map"],
        },
    },

    ssr: false,

    css: ["~/assets/css/main.css"],

    app: {
        head: {
            htmlAttrs: { lang: "ru" },
        },
    },

    vite: {
        plugins: [tailwindcss()],
    },

    runtimeConfig: {
        public: {
            shopUuid: process.env.VITE_SHOP_UUID,
            sentryDsn: process.env.SENTRY_DSN,
        },
    },

    nitro: {
        output: { publicDir: "dist" },
    },

    compatibilityDate: "2026-11-19",
})
