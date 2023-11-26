<template>
    <nav class="navbar navbar-default navbar-static-top">
        <div class="container">
            <div class="navbar-header">
                <button
                    type="button"
                    class="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target="#navbar"
                    aria-expanded="false"
                    aria-controls="navbar"
                >
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>
            <div
                v-if="shop != null"
                id="navbar"
                class="navbar-collapse collapse"
            >
                <ul class="nav navbar-nav">
                    <li><a href="/">Главная</a></li>

                    <li v-if="shop.web_shop_rules != null">
                        <a href="rules">Правила</a>
                    </li>
                    <li v-if="shop.web_telegram_bot_link">
                        <a
                            target="_blank"
                            v-bind:href="'https://t.me/' + shop['bot_username']"
                            >TELEGRAM BOT</a
                        >
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    props: ["shop"],
}
</script>
