import * as Sentry from "@sentry/nuxt"

const config = useRuntimeConfig()

Sentry.init({
    dsn: config.public.sentryDsn,
    enabled: !import.meta.dev,
    integrations: [Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
})
