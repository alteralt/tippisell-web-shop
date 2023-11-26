<template>
    <NavBar v-bind:shop="shop" />

    <div v-if="shop != null" class="container">
        <div class="row row-block row-block-footer">
            <div class="col-md-12">
                <span v-html="shop.web_shop_rules"></span>
            </div>
        </div>
    </div>

    <Footer v-bind:shop="shop" />
</template>

<script>
import Footer from "../components/Footer.vue"
import NavBar from "../components/NavBarMain.vue"

export default {
    components: {
        NavBar,
        Footer,
    },
    props: ["shop"],
}
</script>
