<template>
    <nav class="mb-5 min-h-[50px] border-b border-black bg-black">
        <ShopContainer>
            <div class="flex justify-end min-[768px]:hidden">
                <button
                    type="button"
                    class="my-2 cursor-pointer rounded border border-[#ddd] px-2.5 py-[9px]"
                    aria-controls="navbar"
                    :aria-expanded="opened"
                    @click="opened = !opened"
                >
                    <span class="sr-only">Toggle navigation</span>
                    <span class="block space-y-1">
                        <span
                            v-for="bar in 3"
                            :key="bar"
                            class="block h-0.5 w-[22px] rounded-[1px] bg-[#888]"
                        ></span>
                    </span>
                </button>
            </div>
            <ul
                id="navbar"
                class="-mx-[15px] border-t border-[#e7e7e7] py-[7.5px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] min-[768px]:mx-0 min-[768px]:flex min-[768px]:border-0 min-[768px]:py-0 min-[768px]:shadow-none"
                :class="{ hidden: !opened }"
            >
                <li>
                    <NuxtLink :to="{ name: 'index' }" :class="linkClass">{{
                        $t("nav.home")
                    }}</NuxtLink>
                </li>
                <li v-if="shop.web_shop_rules != null">
                    <NuxtLink :to="{ name: 'rules' }" :class="linkClass">{{
                        $t("nav.rules")
                    }}</NuxtLink>
                </li>
                <li v-if="shop.web_telegram_bot_link">
                    <a
                        target="_blank"
                        :href="'https://t.me/' + shop.bot_username"
                        :class="linkClass"
                        >TELEGRAM BOT</a
                    >
                </li>
            </ul>
        </ShopContainer>
    </nav>
</template>

<script setup lang="ts">
const shop = useShop()

const opened = ref(false)

const linkClass =
    "block px-[15px] py-2.5 leading-5 text-[#777] hover:text-[#cdcdcd] min-[768px]:py-[15px]"
</script>
