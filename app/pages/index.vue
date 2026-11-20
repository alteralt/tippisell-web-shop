<template>
    <main>
        <Transition
            enter-active-class="transition-opacity duration-[600ms]"
            leave-active-class="transition-opacity duration-[600ms]"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
        >
            <div v-if="popupOpened" class="fixed inset-0 z-2 bg-black/80"></div>
        </Transition>

        <NavBarMain />

        <ShopContainer>
            <div class="mb-[30px] h-[41px] bg-black/40"></div>

            <div
                class="overflow-x-auto max-[767px]:mb-[15px] max-[767px]:border max-[767px]:border-[#ddd]"
            >
                <table
                    class="w-full border-collapse border border-[#ddd] max-[767px]:border-0"
                >
                    <tr class="bg-[#fff8dc]">
                        <th :class="headClass">{{ $t("catalog.product") }}</th>
                        <th :class="headClass">{{ $t("catalog.count") }}</th>
                        <th :class="headClass">{{ $t("catalog.price") }}</th>
                        <th :class="headClass"></th>
                    </tr>

                    <tr
                        v-for="product in catalog.products"
                        :key="product.id"
                        class="bg-[#fff8dc]"
                    >
                        <ProductComponent
                            :product="product"
                            :currency-symbol="currencySymbol"
                            @buy="buy"
                        />
                    </tr>
                    <template
                        v-for="category in catalog.categories"
                        :key="category.id"
                    >
                        <tr class="bg-black text-white">
                            <td
                                colspan="4"
                                class="border border-[#ddd] p-2 text-center align-top max-[767px]:whitespace-nowrap"
                            >
                                {{ category.name }}
                            </td>
                        </tr>
                        <tr
                            v-for="product in catalog.categoriesProducts[
                                category.id
                            ]"
                            :key="product.id"
                            class="bg-[#fff8dc]"
                        >
                            <ProductComponent
                                :product="product"
                                :currency-symbol="currencySymbol"
                                @buy="buy"
                            />
                        </tr>
                    </template>
                </table>
            </div>

            <Transition
                enter-active-class="transition-opacity duration-[600ms]"
                leave-active-class="transition-opacity duration-[600ms]"
                enter-from-class="opacity-0"
                leave-to-class="opacity-0"
                @after-leave="resetPurchase"
            >
                <div
                    v-if="popupOpened"
                    class="fixed inset-0 z-100 overflow-x-hidden overflow-y-auto"
                >
                    <div
                        class="mx-auto my-[50px] max-w-[500px] rounded-[5px] bg-white px-5 pt-[15px] pb-5"
                    >
                        <div
                            class="-mx-5 flex items-center justify-between border-b border-[#eef0f0] pb-[15px] pl-5 font-bold uppercase"
                        >
                            {{ $t("payment.title") }}
                            <button
                                type="button"
                                class="mx-5 flex cursor-pointer text-[20px] text-[#a3a5a8]"
                                :aria-label="$t('payment.close')"
                                @click="closeBuyPopup"
                            >
                                <Icon name="fa:close" class="text-[14.6px]" />
                            </button>
                        </div>

                        <div v-if="invoiceId !== null">
                            <table
                                class="mt-2.5 mb-5 w-full border-collapse text-[16px] [&_td]:border [&_td]:border-[#ddd] [&_td]:p-2 [&_td]:align-top [&_td]:text-black [&_td:first-child]:w-[140px] [&_tr:hover]:bg-[#f5f5f5] [&_tr:nth-of-type(odd)]:bg-[#f9f9f9]"
                            >
                                <tbody>
                                    <tr>
                                        <td>{{ $t("payment.product") }}</td>
                                        <td
                                            v-if="currentProduct != null"
                                            class="w-[100px]"
                                        >
                                            {{ currentProduct.name }}
                                        </td>
                                    </tr>
                                    <tr v-if="countGoods > 0">
                                        <td>{{ $t("payment.count") }}</td>
                                        <td>{{ countGoods }}</td>
                                    </tr>
                                    <tr>
                                        <td>{{ $t("payment.total") }}</td>
                                        <td>
                                            {{ sumAmount }}
                                            {{ currencySymbol }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div
                                class="border-t border-[#e5e5e5] p-[15px] text-right [&>*+*]:ml-[5px]"
                            >
                                <a
                                    v-if="payUrl"
                                    :class="[buttonClass, primaryClass]"
                                    :href="payUrl"
                                    target="blank"
                                >
                                    {{ $t("payment.pay") }}
                                </a>

                                <LoadingButton
                                    v-if="purchase === null"
                                    :text="$t('payment.check')"
                                    :class="[buttonClass, primaryClass]"
                                    :loading-text="$t('payment.checking')"
                                    :loading="loading.payButton"
                                    @click="checkPay"
                                />
                                <a
                                    v-else
                                    :class="[buttonClass, primaryClass]"
                                    :href="purchase.download_url ?? undefined"
                                    target="blank"
                                    >{{ $t("payment.download") }}</a
                                >
                            </div>
                        </div>
                        <form v-if="currentProduct != null">
                            <table
                                class="mt-2.5 w-full [&_td]:px-[5px] [&_td]:py-[7px] [&_td:first-child]:w-[140px]"
                            >
                                <tr>
                                    <td colspan="2">
                                        {{ currentProduct.name }}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>
                                        <input
                                            v-model="email"
                                            type="text"
                                            required
                                            :class="fieldClass"
                                            class="w-full"
                                            :disabled="payUrl != null"
                                        />
                                    </td>
                                </tr>
                                <tr
                                    v-if="currentProduct.is_infinitely == false"
                                >
                                    <td>{{ $t("payment.quantity") }}</td>
                                    <td>
                                        <input
                                            v-model="countGoods"
                                            type="text"
                                            :class="fieldClass"
                                            class="w-[100px]"
                                            :disabled="payUrl != null"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{ $t("payment.method") }}</td>
                                    <td>
                                        <select
                                            v-model="payMethod"
                                            class="h-[30px] border border-[#dcdfdf] bg-white p-1.5 leading-[normal] text-black disabled:opacity-70"
                                            :disabled="payUrl != null"
                                        >
                                            <option
                                                v-for="paymentSystem in shop.payment_methods"
                                                :key="paymentSystem"
                                                :value="paymentSystem"
                                            >
                                                {{ paymentSystem }}
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{ $t("payment.coupon") }}</td>
                                    <td>
                                        <div class="flex">
                                            <input
                                                v-model="couponCode"
                                                class="h-[34px] w-full min-w-0 rounded-l border border-[#ccc] bg-white px-3 py-1.5 text-[#555] shadow-[inset_0_1px_1px_rgba(0,0,0,0.075)] transition-[border-color,box-shadow] duration-150 focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,0.075),0_0_8px_rgba(102,175,233,0.6)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#eee]"
                                                :disabled="payUrl != null"
                                            />
                                            <button
                                                :class="[
                                                    buttonClass,
                                                    successClass,
                                                ]"
                                                class="-ml-px rounded-l-none"
                                                type="button"
                                                :disabled="!couponCode"
                                                @click="checkCoupon"
                                            >
                                                {{ $t("payment.apply") }}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>{{ $t("payment.total") }}</td>
                                    <td class="font-bold text-[#1f9e5b]">
                                        <span>{{ sumAmount }}</span>
                                        <span
                                            v-if="typeof sumAmount === 'number'"
                                        >
                                            {{ currencySymbol }}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <div v-if="shop.web_shop_rules != null">
                                <i18n-t keypath="payment.agree" scope="global">
                                    <template #rules>
                                        <NuxtLink
                                            :to="{ name: 'rules' }"
                                            target="blank"
                                            class="text-[#0010c6]"
                                        >
                                            {{ $t("payment.rulesLink") }}
                                        </NuxtLink>
                                    </template>
                                </i18n-t>
                                <input
                                    v-model="rules"
                                    type="checkbox"
                                    name="offer"
                                    required
                                    :disabled="payUrl != null"
                                />
                            </div>
                            <br />
                            <footer
                                class="overflow-hidden border-t border-[#eef0f0] pt-5"
                            >
                                <LoadingButton
                                    :loading="loading.goToPayButton"
                                    type="submit"
                                    :class="[buttonClass, successClass]"
                                    :disabled="
                                        (shop.web_shop_rules != null &&
                                            rules == false) ||
                                        validateEmail(email) == false ||
                                        invoiceId !== null
                                    "
                                    :text="$t('payment.goToPay')"
                                    :loading-text="$t('payment.goingToPay')"
                                    @click="goToPay"
                                />
                            </footer>
                        </form>
                    </div>
                </div>
            </Transition>
        </ShopContainer>

        <FooterComponent />
    </main>
</template>

<script setup lang="ts">
import type { Category, Invoice, Product, Purchase, User } from "~/types"

const shop = useShop()

const client = new TippisellClient(shop.value.id)

const loadCatalog = async () => {
    const [allProducts, allCategories] = await Promise.all([
        client.getAllProducts(),
        client.getAllCategories(),
    ])

    const visibleProducts = allProducts.filter(
        (product) =>
            !shop.value.hide_empty_products || product.count_positions !== 0,
    )
    const products = visibleProducts.filter(
        (product) => product.category_id === null,
    )
    const categoriesProducts: Partial<Record<number, Product[]>> = {}
    for (const product of visibleProducts) {
        if (product.category_id === null) {
            continue
        }
        categoriesProducts[product.category_id] ??= []
        categoriesProducts[product.category_id]!.push(product)
    }

    const categories = allCategories.filter(
        (category) =>
            !shop.value.hide_empty_products ||
            categoriesProducts[category.id] !== undefined,
    )

    return { products, categories, categoriesProducts }
}

const { data: catalog } = await useAsyncData("catalog", loadCatalog, {
    default: () => ({
        products: [] as Product[],
        categories: [] as Category[],
        categoriesProducts: {} as Partial<Record<number, Product[]>>,
    }),
})

const currencySymbol = new Intl.NumberFormat("ru", {
    style: "currency",
    currency: shop.value.currency,
})
    .formatToParts(0)
    .find((part) => part.type === "currency")!.value

const { t } = useI18n()

const loading = reactive({ payButton: false, goToPayButton: false })

const popupOpened = ref(false)

const headClass = "border border-[#ddd] p-2 text-center align-top"

const buttonClass =
    "inline-block cursor-pointer rounded border px-3 py-1.5 text-center text-[14px] leading-[1.42857] whitespace-nowrap select-none disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none"

const successClass =
    "border-black bg-black text-white hover:border-[#398439] hover:bg-[#449d44] disabled:border-[#4cae4c] disabled:bg-[#5cb85c]"

const primaryClass =
    "border-transparent bg-[#337ab7] text-white hover:border-[#204d74] hover:bg-[#286090]"

const fieldClass =
    "border border-[#dcdfdf] bg-white p-1.5 text-[0.9em] text-black disabled:bg-[rgba(239,239,239,0.3)]"
const currentProduct = ref<Product | null>(null)
const payMethod = ref(shop.value.payment_methods[0]!)
const countGoods = ref<number | string>(0)
const email = ref("")
const couponCode = ref("")
const rules = ref(false)
const payUrl = ref<string | null>(null)
const invoiceId = ref<Invoice["invoice_id"] | null>(null)
const discountPercent = ref(0)
const user = ref<User | null>(null)
const purchase = ref<Purchase | null>(null)

useHead({
    bodyAttrs: { class: () => (popupOpened.value ? "overflow-hidden" : "") },
})

const sumAmount = computed(() => {
    if (currentProduct.value === null) {
        return null
    }

    const count = Number(countGoods.value)
    if (count > (currentProduct.value.count_positions ?? 0)) {
        return t("payment.notEnough")
    }

    let sum = currentProduct.value.price * count
    if (discountPercent.value > 0) {
        sum -= (sum / 100) * discountPercent.value
    }

    return Math.ceil(sum * 100) / 100
})

const validateEmail = (value: string) => {
    // prettier-ignore
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(value)
}

const buy = (product: Product) => {
    currentProduct.value = product
    countGoods.value = product.min_buy
    discountPercent.value = 0
    popupOpened.value = true
}

const goToPay = async (event: Event) => {
    event.preventDefault()
    const product = currentProduct.value!
    const count = Number(countGoods.value)
    loading.goToPayButton = true

    if (count < product.min_buy) {
        alert(t("payment.minCount", { count: product.min_buy }))
        loading.goToPayButton = false
        return
    }

    if ((product.count_positions ?? 0) < count) {
        alert(t("payment.notEnough"))
        loading.goToPayButton = false
        return
    }

    const amount = sumAmount.value as number
    const shopUser = await client.getOrCreateUserByEmail(email.value)
    user.value = shopUser

    let response: Invoice | undefined
    if (payMethod.value === "aaio") {
        response = await client.createAAIOInvoice(shopUser.id, amount)
    } else if (payMethod.value.startsWith("crypto_bot")) {
        response = await client.createCryptoBotInvoice(shopUser.id, amount)
    } else if (payMethod.value === "crystal_pay") {
        response = await client.createCrystalPayInvoice(shopUser.id, amount)
    }
    loading.goToPayButton = false
    payUrl.value = response!.url
    invoiceId.value = response!.invoice_id
}

const checkPay = async () => {
    const product = currentProduct.value!
    loading.payButton = true

    let isPaid = true
    if (payMethod.value === "aaio") {
        isPaid = await client.checkAAIOInvoice(user.value!.id, invoiceId.value!)
    }

    if (isPaid === false) {
        loading.payButton = false
        alert(t("payment.notFound"))
        return
    }

    const freshUser = await client.getOrCreateUserByEmail(email.value)

    if (freshUser.balance < (sumAmount.value as number)) {
        loading.payButton = false
        alert(t("payment.notFound"))
        return
    }

    purchase.value = await client.purchaseProcess(
        freshUser.id,
        product.id,
        product.is_infinitely === false ? Number(countGoods.value) : null,
    )
    loading.payButton = false
}

const checkCoupon = async () => {
    const coupon = await client.getOrNoneCoupon(couponCode.value)
    discountPercent.value = coupon.percent
}

const closeBuyPopup = () => {
    if (
        payUrl.value !== null &&
        purchase.value === null &&
        confirm(t("payment.abort")) === false
    ) {
        return
    }
    popupOpened.value = false
}

const resetPurchase = () => {
    currentProduct.value = null
    payUrl.value = null
    invoiceId.value = null
    discountPercent.value = 0
    email.value = ""
    rules.value = false
    couponCode.value = ""
    countGoods.value = 0
    user.value = null
    purchase.value = null
}
</script>
