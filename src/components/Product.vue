<template>
    <td v-tooltip="{ content: product.description, html: true }">
        <div class="title">
            {{ product.name }}
        </div>
    </td>
    <td>
        <span
            v-if="
                product.is_infinitely == false
            "
            >{{ product.count_positions }}</span
        >
        <img
            v-else
            src="/static/images/icons/infinity-svgrepo-com.svg"
        />
    </td>
    <td>
        <span class="price_tbl">{{
            product.price
        }}</span
        >&nbsp;<span class="rouble">{{
            currencySymbol
        }}</span>
    </td>
    <td class="text-center">
        <a
            class="buy hov-pointer"
            v-on:click="buy(product)"
        >
            <i class="fa fa-shopping-cart">
                Купить</i
            >
        </a>
    </td>
</template>

<script>
export default {
    props: ["product", "currencySymbol"],
}
</script>
