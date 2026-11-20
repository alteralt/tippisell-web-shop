<template>
    <td
        v-tooltip="{ content: product.description, html: true }"
        :class="cellClass"
        class="w-[600px]"
    >
        <div
            class="table-cell max-w-[385px] overflow-hidden pl-[30px] leading-5 text-ellipsis whitespace-nowrap min-[992px]:max-w-[600px] min-[1200px]:max-w-[800px]"
        >
            {{ product.name }}
        </div>
    </td>
    <td :class="cellClass" class="w-20 text-center">
        <span v-if="product.is_infinitely == false">{{
            product.count_positions
        }}</span>
        <img
            v-else
            class="inline"
            src="~/assets/images/icons/infinity-svgrepo-com.svg"
        />
    </td>
    <td :class="cellClass" class="w-[150px] text-center">
        <span class="text-[#1a7e1b]">{{ product.price }}</span>&nbsp;<span>{{
            currencySymbol
        }}</span>
    </td>
    <td :class="cellClass" class="text-center">
        <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1 align-top leading-none text-[#337ab7] hover:text-[#23527c] hover:underline"
            @click="emit('buy', product)"
        >
            <Icon name="fa:shopping-cart" class="text-[11px]" />
            {{ $t("catalog.buy") }}
        </button>
    </td>
</template>

<script setup lang="ts">
import type { Product } from "~/types"

defineProps<{ product: Product; currencySymbol: string }>()

const emit = defineEmits<{ buy: [product: Product] }>()

const cellClass =
    "border border-[#ddd] p-2 align-top max-[767px]:whitespace-nowrap"
</script>
