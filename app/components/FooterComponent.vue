<template>
    <footer
        v-if="shop.is_premium == false"
        class="absolute bottom-0 h-10 w-full bg-black/80"
    >
        <ShopContainer
            class="pt-3 text-right font-[Open_Sans,sans-serif] text-xs text-white"
        >
            {{ $t("footer.rented") }}
            <a
                :href="TIPPISELL_URL"
                target="_blank"
                class="text-[#337ab7] hover:text-[#23527c] hover:underline"
            >
                TIPPISELL
            </a>
        </ShopContainer>
    </footer>
</template>

<script setup lang="ts">
const shop = useShop()
</script>
