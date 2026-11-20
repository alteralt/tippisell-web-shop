<template>
    <footer v-if="shop.is_premium == false" id="footer">
        <div class="container">
            <div class="text-muted">
                Магазин арендован в сервисе
                <a :href="TIPPISELL_URL" target="_blank">TIPPISELL</a>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
const shop = useShop()
</script>
