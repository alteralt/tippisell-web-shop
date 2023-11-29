<template>
    <router-view
        v-if="shop != null"
        v-bind:shop="shop"
        v-bind:tippisellClient="tippisellClient"
        v-bind:tippisellUrl="tippisellUrl"
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
            tippisellUrl: "https://tippisell.xyz",
        }
    },
    async created() {
        const client = new Client()

        if (import.meta.env.VITE_SHOP_UUID !== undefined) {
            // Если указан UUID магазина
            this.shop = await client.getShopByUUID(
                import.meta.env.VITE_SHOP_UUID,
            )
        } else {
            const subdomain = window.location.host.split(".")[0]

            try {
                this.shop = await client.getShopBySubdomain(
                    subdomain.replaceAll("-", "_"),
                )
            } catch (error) {
                if (error.response.status === 401) {
                    // Если не найден магазин
                    window.location.href = this.tippisellUrl
                }
                // eslint-disable-next-line no-console
                console.log(error)
                throw error
            }

            if (this.shop.web === false) {
                // Если веб-шоп не работает
                window.location.href = this.tippisellUrl
            }
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
