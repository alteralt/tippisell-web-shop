export default defineNuxtConfig({
    modules: ["@nuxt/eslint", "floating-vue/nuxt", "@sentry/nuxt/module"],

    sourcemap: { client: process.env.SENTRY_AUTH_TOKEN ? "hidden" : false },

    sentry: {
        telemetry: false,
        sourcemaps: {
            disable: !process.env.SENTRY_AUTH_TOKEN,
            filesToDeleteAfterUpload: ["dist/**/*.map"],
        },
    },

    ssr: false,

    css: ["~/assets/css/style.css"],

    app: {
        head: {
            htmlAttrs: { lang: "ru" },
            link: [
                {
                    rel: "stylesheet",
                    href: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css",
                },
                {
                    rel: "stylesheet",
                    href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css",
                },
            ],
        },
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
