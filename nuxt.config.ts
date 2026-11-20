import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
    modules: [
        "@nuxt/eslint",
        "@nuxt/icon",
        "@nuxtjs/i18n",
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

    i18n: {
        defaultLocale: "ru",
        strategy: "no_prefix",
        locales: [
            { code: "ru", language: "ru-RU", file: "ru.json" },
            { code: "en", language: "en-US", file: "en.json" },
        ],
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
