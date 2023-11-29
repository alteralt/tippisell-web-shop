<template>
    <main id="content" class="b-shop">
        <div id="overlay"></div>

        <NavBar v-bind:shop="shop" />

        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="row row-block row-block-header">
                        <div class="col-md-12">
                            <p class="text-center">
                                <span style="color: rgb(255, 255, 255)"></span>
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

                            <tr v-for="product in products" :key="product.id">
                                <Product
                                    v-bind:product="product"
                                    v-bind:currencySymbol="currencySymbol"
                                    v-bind:buy="buy"
                                />
                            </tr>
                            <template
                                v-for="category in categories"
                                :key="category.id"
                            >
                                <tr class="separator">
                                    <td colspan="4" class="text-center">
                                        {{ category.name }}
                                    </td>
                                </tr>
                                <tr
                                    v-for="product in this.categoriesProducts[
                                        category.id
                                    ]"
                                    :key="product.id"
                                >
                                    <Product
                                        v-bind:product="product"
                                        v-bind:currencySymbol="currencySymbol"
                                        v-bind:buy="buy"
                                    />
                                </tr>
                            </template>
                        </table>
                    </div>

                    <div class="choose_popup">
                        <div class="popup-modal" style="max-width: 500px">
                            <div class="title">
                                Оплата
                                <i
                                    class="fa fa-times pull-right"
                                    v-on:click="closeBuyPopup"
                                ></i>
                            </div>

                            <div
                                aria-hidden="false"
                                class=""
                                id="paymodal"
                                style="display: none"
                            >
                                <!-- prettier-ignore -->
                                <table
                                    class="
                                    additionaltable
                                    table
                                    table-striped
                                    table-bordered
                                    table-hover
                                    "
                                    style="font-size: 16px; position: relative"
                                >
                                    <tbody>
                                        <tr>
                                            <td>Товар:</td>
                                            <td
                                                v-if="currentProduct != null"
                                                style="width: 100px"
                                                id="payitem"
                                                class="payitem"
                                            >
                                                {{ currentProduct.name }}
                                            </td>
                                        </tr>
                                        <tr if v-if="countGoods > 0">
                                            <td>Кол-во:</td>
                                            <td id="paycount" class="paycount">
                                                {{ countGoods }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>К оплате:</td>
                                            <td id="payprice" class="payprice">
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
                                        v-if="purchase == null"
                                        class="btn btn-primary"
                                        id="go_to_pay_url"
                                        type="button"
                                        target="blank"
                                        :href="payUrl"
                                        >Перейти к оплате</a
                                    >
                                    <input
                                        v-if="purchase == null"
                                        class="checkpaybtn btn btn-primary"
                                        value="Проверить оплату"
                                        data-loading-text="Проверяем..."
                                        type="button"
                                        v-on:click="checkPay"
                                    />
                                    <a
                                        v-else
                                        class="checkpaybtn btn btn-primary"
                                        :href="purchase['download_url']"
                                        target="blank"
                                        >Скачать файл</a
                                    >
                                </div>
                            </div>
                            <form id="order" v-if="currentProduct != null">
                                <table>
                                    <tr>
                                        <td colspan="2">
                                            {{ currentProduct["name"] }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email:</td>
                                        <td>
                                            <input
                                                type="text"
                                                v-model="email"
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
                                                    :key="paymentSystem.id"
                                                    :value="paymentSystem"
                                                    :m_name="paymentSystem"
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
                                                    class="form-control"
                                                    v-model="couponCode"
                                                    :disabled="payUrl != null"
                                                />
                                                <span class="input-group-btn">
                                                    <button
                                                        class="btn btn-success shadow-none"
                                                        type="button"
                                                        :disabled="
                                                            couponCode ==
                                                                null ||
                                                            couponCode == ''
                                                        "
                                                        v-on:click="checkCoupon"
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
                                            <span id="currency">
                                                {{ currencySymbol }}.</span
                                            >
                                        </td>
                                    </tr>
                                </table>
                                <div
                                    class="soglas"
                                    v-if="shop.web_shop_rules != null"
                                >
                                    Согласен С
                                    <a
                                        href="/rules"
                                        target="blank"
                                        style="color: #0010c6"
                                    >
                                        правилами/условиями
                                    </a>
                                    магазина
                                    <input
                                        type="checkbox"
                                        name="offer"
                                        required
                                        v-model="rules"
                                        :disabled="payUrl != null"
                                    />
                                </div>
                                <br />
                                <footer>
                                    <button
                                        type="submit"
                                        class="btn btn-success btn-leque"
                                        v-on:click="goToPay"
                                        :disabled="
                                            rules == false ||
                                            validateEmail(email) == false
                                        "
                                    >
                                        Перейти к оплате
                                    </button>
                                </footer>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <FooterComponent v-bind:shop="shop" />
    </main>
</template>

<script>
import "floating-vue/dist/style.css"

import getCurrencySymbol from "currency-symbols"
import { loadScript } from "vue-plugin-load-script"

import FooterComponent from "../components/FooterComponent.vue"
import NavBar from "../components/NavBarMain.vue"
import Product from "../components/ProductComponent.vue"

loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
).then(() => {
    loadScript(
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js",
    )
})

export default {
    async created() {
        const values = await Promise.all([
            this.tippisellClient.getAllProducts(),
            await this.tippisellClient.getAllCategories(),
        ])
        // eslint-disable-next-line no-underscore-dangle
        const products_ = values[0]
        // eslint-disable-next-line no-underscore-dangle
        const categories_ = values[1]

        const products = []
        const categoriesProducts = {}

        for (let i = 0; i < products_.length; i += 1) {
            const product = products_[i]

            if (
                this.shop.hide_empty_products &&
                product.count_positions === 0
            ) {
                // Если пустые продукты скрыты и товаров у текущего продукта нет
                // eslint-disable-next-line no-continue
                continue
            }

            if (product.category_id != null) {
                // eslint-disable-next-line no-underscore-dangle
                const products__ = categoriesProducts[product.category_id] || []
                products__.push(product)
                categoriesProducts[product.category_id] = products__
                // eslint-disable-next-line no-continue
                continue
            }

            products.push(product)
        }

        const categories = []

        for (let i = 0; i < categories_.length; i += 1) {
            const category = categories_[i]
            if (
                this.shop.hide_empty_products &&
                categoriesProducts[category.id] === undefined
            ) {
                // Если скрыты пустые товары и в категории нет
                // eslint-disable-next-line no-continue
                continue
            }
            categories.push(category)
        }

        this.products = products
        this.categoriesProducts = categoriesProducts
        this.categories = categories
    },
    components: { NavBar, FooterComponent, Product },
    props: ["shop", "tippisellClient"],
    methods: {
        async goToPay(event) {
            event.preventDefault()

            if (
                parseInt(this.countGoods, 10) <
                parseInt(this.currentProduct.min_buy, 10)
            ) {
                // eslint-disable-next-line no-alert
                alert(
                    `Мин. кол-во товара ${this.currentProduct.min_buyinCount}`,
                )
            }

            if (
                parseInt(this.currentProduct.count_positions, 10) <
                parseInt(this.countGoods, 10)
            ) {
                // eslint-disable-next-line no-alert
                alert("Такого количества товара нет")
                return false
            }

            this.sumAmount = document.getElementById("sum").innerText
            this.user = await this.tippisellClient.getOrCreateUserByEmail(
                this.email,
            )

            let response
            if (this.payMethod === "aaio") {
                response = await this.tippisellClient.createAAIOInvoice(
                    this.user.id,
                    this.sumAmount,
                )
            } else if (this.payMethod.startsWith("crypto_bot")) {
                const coin = this.payMethod.split("_")[2].toUpperCase()
                response = await this.tippisellClient.createCryptoBotInvoice(
                    this.user.id,
                    this.sumAmount,
                    coin,
                )
            } else if (this.payMethod === "crystal_pay") {
                response = await this.tippisellClient.createCrystalPayInvoice(
                    this.user.id,
                    this.sumAmount,
                )
            }
            this.payUrl = response.url
            this.invoiceId = response.invoice_id

            $("#selectPay").hide()
            $("#paymodal").show()

            return null
        },
        async checkPay() {
            $(".checkpaybtn").button("loading")

            let isPaid = true
            if (this.payMethod === "aaio") {
                isPaid = await this.tippisellClient.checkAAIOInvoice(
                    this.user.id,
                    this.invoiceId,
                )
            }

            if (isPaid === false) {
                $(".checkpaybtn").button("reset")
                // eslint-disable-next-line no-alert
                alert("Платеж не найден! Попробуйте позже")
                return
            }

            const user = await this.tippisellClient.getOrCreateUserByEmail(
                this.email,
            )

            if (user.balance < this.sumAmount) {
                $(".checkpaybtn").button("reset")
                // eslint-disable-next-line no-alert
                alert("Платеж не найден! Попробуйте позже")
                return
            }

            let count
            if (this.currentProduct.is_infinitely === false) {
                count = this.countGoods
            } else {
                count = null
            }

            this.purchase = await this.tippisellClient.purchaseProcess(
                user.id,
                this.currentProduct.id,
                count,
            )
            $(".checkpaybtn").button("reset")
        },
        async checkCoupon() {
            const coupon = await this.tippisellClient.getOrNoneCoupon(
                this.couponCode,
            )

            this.discountPercent = parseInt(coupon.percent, 10)

            let count
            if (this.currentProduct.is_infinitely === false) {
                count = this.countGoods
            } else {
                count = 1
            }

            this.sumAmount = this.generateSum(count, this.currentProduct.price)
        },
        buy(product) {
            this.currentProduct = product
            const $popup = $(".choose_popup")

            $(".order_popup").remove()
            $("#order").show()
            $("body").addClass("popup-open")

            this.countGoods = product.min_buy
            this.discountPercent = 0

            $popup.find("#discount_code").val("")

            this.sumAmount = this.generateSum(product.min_buy, product.price)

            $("#overlay, .choose_popup").fadeIn("slow")

            return false
        },
        generateSum(count, price) {
            if (count > this.currentProduct.count_positions) {
                $(".choose_popup #currency").hide()
                return "Такого кол-ва товара нет"
            }
            const sum = this.generateSumDiscount(price * count)

            return Math.ceil(sum * 100) / 100
        },
        generateSumDiscount(sum) {
            if (this.discountPercent > 0) {
                return sum - (sum / 100) * this.discountPercent
            }

            return sum
        },
        validateEmail(email) {
            // prettier-ignore
            // eslint-disable-next-line no-useless-escape
            const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        },
        closeBuyPopup() {
            if (this.payUrl !== null) {
                // eslint-disable-next-line no-alert, no-restricted-globals
                const closeConfirm = confirm(
                    "Вы уверены, что хотите прервать процесс покупки?",
                )
                if (closeConfirm === false) {
                    // Если пользователь уверен, что хочет прервать покупку
                    return
                }
            }
            $("#overlay, .choose_popup, .success_popup").fadeOut("slow")
            $("body").removeClass("popup-open")

            setTimeout(() => {
                this.currentProduct = null
                this.payUrl = null
                this.invoiceId = null
                this.discountPercent = null
                this.email = null
                this.rules = null
            }, 500)
        },
    },
    // eslint-disable-next-line func-names
    data: function () {
        return {
            // v-models
            payMethod: this.shop.payment_methods[0],
            countGoods: 0,
            email: null,
            couponCode: null,
            rules: false, // Принял ли пользователь правила
            //

            payUrl: null, // Ссылка, по которой пользователь должен оплатить
            invoiceId: null, // ID инвойса

            // Если пользователь применил промокод, то здесь будет значение процента скидки
            discountPercent: 0,
            currentProduct: null, // Выбраный продукт для покупки
            sumAmount: null, // Сумма покупки, с учётом скидки
            currencySymbol: getCurrencySymbol(this.shop.currency),
            user: null,
            purchase: null,
            products: [],
            categories: [],
        }
    },
    watch: {
        countGoods(newValue) {
            this.sumAmount = this.generateSum(
                newValue,
                this.currentProduct.price,
            )
        },
    },
}
</script>
