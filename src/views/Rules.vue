<template>
    <NavBar v-bind:shop="shop" />

    <div v-if="shop != null" class="container">
        <div class="row row-block row-block-footer">
            <div class="col-md-12">
                <span v-html="shop.web_shop_rules"></span>
            </div>
        </div>
    </div>

    <FooterComponent v-bind:shop="shop" v-bind:tippisellUrl="tippisellUrl"/>
</template>

<script>
import FooterComponent from "../components/FooterComponent.vue"
import NavBar from "../components/NavBarMain.vue"

export default {
    components: {
        NavBar,
        FooterComponent,
    },
    props: ["shop", "tippisellUrl"],
}
</script>
