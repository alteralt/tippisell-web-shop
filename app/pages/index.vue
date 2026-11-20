<template>
    <main id="content" class="b-shop">
        <Transition name="fade">
            <div v-if="popupOpened" id="overlay" style="display: block"></div>
        </Transition>

        <NavBarMain />

        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="row row-block row-block-header">
                        <div class="col-md-12">
                            <p class="text-center">
                                <span class="text-white"></span>
                            </p>
                        </div>
                    </div>
                    <div
                        class="fslides"
                        style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-bottom: 10px;
                            flex-wrap: wrap;
                        "
                    ></div>

                    <div class="table-responsive">
                        <table class="table table-bordered shop_goods">
                            <tr>
                                <th>Продукт</th>
                                <th>Кол&#8209;во</th>
                                <th>За&nbsp;1&nbsp;шт.</th>
                                <th></th>
                            </tr>

                            <tr
                                v-for="product in catalog.products"
                                :key="product.id"
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
                                <tr class="separator">
                                    <td colspan="4" class="text-center">
                                        {{ category.name }}
                                    </td>
                                </tr>
                                <tr
                                    v-for="product in catalog
                                        .categoriesProducts[category.id]"
                                    :key="product.id"
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

                    <Transition name="fade" @after-leave="resetPurchase">
                        <div
                            v-if="popupOpened"
                            class="choose_popup"
                            style="display: block"
                        >
                            <div class="popup-modal" style="max-width: 500px">
                                <div class="title">
                                    Оплата
                                    <i
                                        class="fa fa-times pull-right"
                                        @click="closeBuyPopup"
                                    ></i>
                                </div>

                                <div v-if="invoiceId !== null">
                                    <table
                                        class="additionaltable table table-striped table-bordered table-hover"
                                        style="
                                            font-size: 16px;
                                            position: relative;
                                        "
                                    >
                                        <tbody>
                                            <tr>
                                                <td>Товар:</td>
                                                <td
                                                    v-if="
                                                        currentProduct != null
                                                    "
                                                    id="payitem"
                                                    style="width: 100px"
                                                    class="payitem"
                                                >
                                                    {{ currentProduct.name }}
                                                </td>
                                            </tr>
                                            <tr v-if="countGoods > 0">
                                                <td>Кол-во:</td>
                                                <td
                                                    id="paycount"
                                                    class="paycount"
                                                >
                                                    {{ countGoods }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>К оплате:</td>
                                                <td
                                                    id="payprice"
                                                    class="payprice"
                                                >
                                                    {{ sumAmount }}
                                                    {{ currencySymbol }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div
                                        class="payfoot modal-footer"
                                        style="position: inherit; top: -20px"
                                    >
                                        <a
                                            v-if="payUrl"
                                            type="button"
                                            class="checkpaybtn btn btn-primary"
                                            :href="payUrl"
                                            target="blank"
                                        >
                                            Оплатить
                                        </a>

                                        <LoadingButton
                                            v-if="purchase === null"
                                            text="Проверить оплату"
                                            class="checkpaybtn btn btn-primary"
                                            loading-text="Проверяем..."
                                            :loading="loading.payButton"
                                            @click="checkPay"
                                        />
                                        <a
                                            v-else
                                            class="checkpaybtn btn btn-primary"
                                            :href="
                                                purchase.download_url ??
                                                undefined
                                            "
                                            target="blank"
                                            >Скачать файл</a
                                        >
                                    </div>
                                </div>
                                <form v-if="currentProduct != null" id="order">
                                    <table>
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
                                                    :disabled="payUrl != null"
                                                />
                                            </td>
                                        </tr>
                                        <tr
                                            v-if="
                                                currentProduct.is_infinitely ==
                                                false
                                            "
                                        >
                                            <td>Количество:</td>
                                            <td>
                                                <input
                                                    v-model="countGoods"
                                                    type="text"
                                                    class="count"
                                                    :disabled="payUrl != null"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Способ оплаты</td>
                                            <td>
                                                <select
                                                    v-model="payMethod"
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
                                            <td>Код купона:</td>
                                            <td>
                                                <div class="input-group">
                                                    <input
                                                        v-model="couponCode"
                                                        class="form-control"
                                                        :disabled="
                                                            payUrl != null
                                                        "
                                                    />
                                                    <span
                                                        class="input-group-btn"
                                                    >
                                                        <button
                                                            class="btn btn-success shadow-none"
                                                            type="button"
                                                            :disabled="
                                                                !couponCode
                                                            "
                                                            @click="checkCoupon"
                                                        >
                                                            Применить
                                                        </button>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>К оплате:</td>
                                            <td class="sum">
                                                <span id="sum">{{
                                                    sumAmount
                                                }}</span>
                                                <span
                                                    v-if="
                                                        typeof sumAmount ===
                                                        'number'
                                                    "
                                                    id="currency"
                                                >
                                                    {{ currencySymbol }}
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                    <div
                                        v-if="shop.web_shop_rules != null"
                                        class="soglas"
                                    >
                                        Согласен С
                                        <NuxtLink
                                            :to="{ name: 'rules' }"
                                            target="blank"
                                            style="color: #0010c6"
                                        >
                                            правилами/условиями
                                        </NuxtLink>
                                        магазина
                                        <input
                                            v-model="rules"
                                            type="checkbox"
                                            name="offer"
                                            required
                                            :disabled="payUrl != null"
                                        />
                                    </div>
                                    <br />
                                    <footer>
                                        <LoadingButton
                                            :loading="loading.goToPayButton"
                                            type="submit"
                                            class="btn btn-success btn-leque"
                                            :disabled="
                                                (shop.web_shop_rules != null &&
                                                    rules == false) ||
                                                validateEmail(email) == false ||
                                                invoiceId !== null
                                            "
                                            text="Перейти к оплате"
                                            loading-text="Переходим к оплате"
                                            @click="goToPay"
                                        />
                                    </footer>
                                </form>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

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

const loading = reactive({ payButton: false, goToPayButton: false })

const popupOpened = ref(false)
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

useHead({ bodyAttrs: { class: () => (popupOpened.value ? "popup-open" : "") } })

const sumAmount = computed(() => {
    if (currentProduct.value === null) {
        return null
    }

    const count = Number(countGoods.value)
    if (count > (currentProduct.value.count_positions ?? 0)) {
        return "Такого кол-ва товара нет"
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
        alert(`Мин. кол-во товара ${product.min_buy}`)
        loading.goToPayButton = false
        return
    }

    if ((product.count_positions ?? 0) < count) {
        alert("Такого количества товара нет")
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
        alert("Платеж не найден! Попробуйте позже")
        return
    }

    const freshUser = await client.getOrCreateUserByEmail(email.value)

    if (freshUser.balance < (sumAmount.value as number)) {
        loading.payButton = false
        alert("Платеж не найден! Попробуйте позже")
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
        confirm("Вы уверены, что хотите прервать процесс покупки?") === false
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
