<template>
    <div>
        <NavBarMain />

        <div class="container">
            <div class="row row-block row-block-footer">
                <div class="col-md-12">
                    <span v-html="shop.web_shop_rules"></span>
                </div>
            </div>
        </div>

        <FooterComponent />
    </div>
</template>

<script setup lang="ts">
const shop = useShop()
</script>
