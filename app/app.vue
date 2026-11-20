<template>
    <NuxtPage v-if="shop" />
</template>

<script setup lang="ts">
import { FetchError } from "ofetch"

const config = useRuntimeConfig()

const loadShop = async () => {
    const client = new TippisellClient()

    if (config.public.shopUuid) {
        return await client.getShopByUUID(config.public.shopUuid)
    }

    const subdomain = window.location.host.split(".")[0]!

    let shop
    try {
        shop = await client.getShopBySubdomain(subdomain.replaceAll("-", "_"))
    } catch (error) {
        if (error instanceof FetchError && error.status === 401) {
            await navigateTo(TIPPISELL_URL, { external: true })
        }
        throw error
    }

    if (shop.web === false) {
        await navigateTo(TIPPISELL_URL, { external: true })
    }

    return shop
}

const { data: shop } = await useAsyncData(SHOP_KEY, loadShop)

useHead({
    title: () => shop.value?.web_title,
    link: () => [{ rel: "icon", href: shop.value?.web_favicon }],
    bodyAttrs: {
        style: () =>
            shop.value ? `background: url(${shop.value.web_background})` : "",
    },
})
</script>
