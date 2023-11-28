<template>
    <router-view
        v-if="shop != null"
        v-bind:shop="shop"
        v-bind:tippisellClient="tippisellClient"
    />
</template>

<script>
import { useFavicon, useTitle } from "@vueuse/core"

import { Client } from "./tippisell.api.js"

export default {
    data() {
        return {
            shop: null,
            tippisellClient: null,
        }
    },
    async created() {
        const subdomain = window.location.host.split(".")[0]

        const client = new Client()
        try {
            this.shop = await client.getShopBySubdomain(
                subdomain.replaceAll("-", "_"),
            )
        } catch (error) {
            if (error.response.status === 401) {
                // Если не найден магазин
                window.location.href = "https://tippisell.xyz"
            }
            // eslint-disable-next-line no-console
            console.log(error)
            throw error
        }

        if (this.shop.web === false) {
            // Если веб-шоп не работает
            window.location.href = "https://tippisell.xyz"
        }

        this.tippisellClient = new Client(this.shop.id)

        const icon = useFavicon()
        icon.value = this.shop.web_favicon

        const title = useTitle()
        title.value = this.shop.web_title

        document.body.style.background = `url(${this.shop.web_background})`
    },
}
</script>
