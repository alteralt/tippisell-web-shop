<template>
    <div>
        <NavBarMain />

        <ShopContainer>
            <div
                class="my-5 bg-black/40 px-[15px] py-5 text-white [&_a]:text-white [&_a]:underline [&_img]:max-w-full"
            >
                <div class="min-h-px">
                    <span v-html="shop.web_shop_rules"></span>
                </div>
            </div>
        </ShopContainer>

        <FooterComponent />
    </div>
</template>

<script setup lang="ts">
const shop = useShop()
</script>
