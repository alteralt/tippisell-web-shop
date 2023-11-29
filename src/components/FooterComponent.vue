<template>
    <footer v-if="shop != null && shop.is_premium == false" id="footer">
        <div class="container">
            <div class="text-muted">
                Магазин арендован в сервисе
                <a :href="tippisellUrl" target="_blank">TIPPISELL</a>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    props: ["shop", "tippisellUrl"],
}
</script>
