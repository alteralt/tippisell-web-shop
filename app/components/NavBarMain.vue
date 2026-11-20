<template>
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">
                <button
                    type="button"
                    class="navbar-toggle"
                    :class="{ collapsed: !opened }"
                    aria-controls="navbar"
                    :aria-expanded="opened"
                    @click="opened = !opened"
                >
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div
                id="navbar"
                class="navbar-collapse collapse"
                :class="{ in: opened }"
            >
                <ul class="nav navbar-nav">
                    <li>
                        <NuxtLink :to="{ name: 'index' }">Главная</NuxtLink>
                    </li>

                    <li v-if="shop.web_shop_rules != null">
                        <NuxtLink :to="{ name: 'rules' }">Правила</NuxtLink>
                    </li>
                    <li v-if="shop.web_telegram_bot_link">
                        <a
                            target="_blank"
                            :href="'https://t.me/' + shop.bot_username"
                            >TELEGRAM BOT</a
                        >
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
const shop = useShop()

const opened = ref(false)
</script>
