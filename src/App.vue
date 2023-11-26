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
        var subdomain = window.location.host.split(".")[0]

        var client = new Client()
        try {
            var shop = await client.getShopBySubdomain(
                subdomain.replaceAll("-", "_"),
            )
        } catch (error) {
            if (error.response.status == 401) {
                // Если не найден магазин
                window.location.href = "https://tippisell.xyz"
            }
            console.log(error)
        }

        if (shop.web == false) {
            // Если веб-шоп не работает
            window.location.href = "https://tippisell.xyz"
        }

        this.shop = shop
        this.tippisellClient = new Client(this.shop["id"])

        let icon = useFavicon()
        icon.value = this.shop["web_favicon"]

        let title = useTitle()
        title.value = this.shop["web_title"]

        document.body.style.background =
            "url(" + this.shop["web_background"] + ")"
    },
}
</script>
