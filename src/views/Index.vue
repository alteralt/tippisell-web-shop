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

                            <tr v-for="product in products">
                                <Product
                                    v-bind:product="product"
                                    v-bind:currencySymbol="currencySymbol"
                                    v-bind:buy="buy"
                                />
                            </tr>
                            <template v-for="category in categories">
                                <tr class="separator">
                                    <td colspan="4" class="text-center">
                                        {{ category.name }}
                                    </td>
                                </tr>
                                <tr
                                    v-for="product in this.categoriesProducts[
                                        category.id
                                    ]"
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
                                <i class="fa fa-times pull-right"></i>
                            </div>

                            <div
                                aria-hidden="false"
                                class=""
                                id="paymodal"
                                style="display: none"
                            >
                                <table
                                    class="additionaltable paytable table table-striped table-bordered table-hover"
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
                                                {{ currentProduct["name"] }}
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
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Способ оплаты</td>
                                        <td>
                                            <select v-model="payMethod">
                                                <option
                                                    v-for="paymentSystem in shop.payment_methods"
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
                                    />
                                </div>
                                <br />
                                <footer>
                                    <button
                                        type="submit"
                                        class="btn btn-success btn-leque"
                                        v-on:click="goToPay"
                                        :disabled="rules == false || validateEmail(email) == false"
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

        <footer v-bind:shop="shop" />
    </main>
</template>

<script>
import "floating-vue/dist/style.css"

import getCurrencySymbol from "currency-symbols"
import { loadScript } from "vue-plugin-load-script"

import Footer from "../components/Footer.vue"
import NavBar from "../components/NavBarMain.vue"
import Product from "../components/Product.vue"

loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
).then(() => {
    loadScript(
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js",
    )

    loadScript("static/js/shop.new.js")
})

export default {
    async created() {
        var values = await Promise.all([
            this.tippisellClient.getAllProducts(),
            await this.tippisellClient.getAllCategories(),
        ])
        var products_ = values[0]
        var categories_ = values[1]

        var products = []
        var categoriesProducts = {}

        for (var i = 0; i < products_.length; i++) {
            var product = products_[i]

            if (
                this.shop["hide_empty_products"] &&
                product["count_positions"] == 0
            ) {
                // Если пустые продукты скрыты и товаров у текущего продукта нет
                continue
            }

            if (product["category_id"] != null) {
                var products__ =
                    categoriesProducts[product["category_id"]] || []
                products__.push(product)
                categoriesProducts[product["category_id"]] = products__
                continue
            }

            products.push(product)
        }

        var categories = []

        for (let i = 0; i < categories_.length; i++) {
            var category = categories_[i]
            if (
                this.shop["hide_empty_products"] &&
                categoriesProducts[category["id"]] == undefined
            ) {
                continue
            }
            categories.push(category)
        }

        this.products = products
        this.categoriesProducts = categoriesProducts
        this.categories = categories
    },
    components: { NavBar, Footer, Product },
    props: ["shop", "tippisellClient"],
    methods: {
        async goToPay(event) {
            event.preventDefault()

            var minCount = isiShop.variables.good_mincount
            var count_accs = isiShop.variables.good_count

            if (parseInt(this.countGoods) < parseInt(minCount)) {
                alert("Мин. кол-во товара " + minCount)
                return false
            }

            if (parseInt(count_accs) < parseInt(this.countGoods)) {
                alert("Такого количества товара нет")
                return false
            }

            this.sumAmount = document.getElementById("sum").innerText
            this.user = await this.tippisellClient.getOrCreateUserByEmail(
                this.email,
            )

            if (this.payMethod == "aaio") {
                var response = await this.tippisellClient.createAAIOInvoice(
                    this.user["id"],
                    this.sumAmount,
                )
            } else if (this.payMethod.startsWith("crypto_bot")) {
                var coin = this.payMethod.split("_")[2].toUpperCase()
                var response =
                    await this.tippisellClient.createCryptoBotInvoice(
                        this.user["id"],
                        this.sumAmount,
                        coin,
                    )
            } else if (this.payMethod == "crystal_pay") {
                var response =
                    await this.tippisellClient.createCrystalPayInvoice(
                        this.user["id"],
                        this.sumAmount,
                    )
            }
            this.payUrl = response["url"]
            this.invoiceId = response["invoice_id"]

            $("#selectPay").hide()
            $("#paymodal").show()
        },
        async checkPay(event) {
            $(".checkpaybtn").button("loading")

            var is_paid = true
            if (this.payMethod == "aaio") {
                var is_paid = await this.tippisellClient.checkAAIOInvoice(
                    this.user["id"],
                    this.invoiceId,
                )
            }

            if (is_paid == false) {
                $(".checkpaybtn").button("reset")
                alert("Платеж не найден! Попробуйте позже")
                return
            }

            var user = await this.tippisellClient.getOrCreateUserByEmail(
                this.email,
            )

            if (user["balance"] < this.sumAmount) {
                $(".checkpaybtn").button("reset")
                alert("Платеж не найден! Попробуйте позже")
                return
            }

            if (this.currentProduct["is_infinitely"] == false) {
                var count = this.countGoods
            } else {
                var count = null
            }
            this.purchase = await this.tippisellClient.purchaseProcess(
                user["id"],
                this.currentProduct["id"],
                count,
            )
            $(".checkpaybtn").button("reset")
        },
        async checkCoupon(event) {
            var coupon = await this.tippisellClient.getOrNoneCoupon(
                this.couponCode,
            )
            var discount_percent = parseInt(coupon["percent"])

            this.discountPercent = discount_percent

            if (this.currentProduct["is_infinitely"] == false) {
                var count = this.countGoods
            } else {
                var count = 1
            }

            this.sumAmount = this.generateSum(
                count,
                this.currentProduct["price"],
            )
        },
        buy(product) {
            this.currentProduct = product
            var $popup = $(".choose_popup")

            $(".order_popup").remove()
            $("#order").show()
            $("body").addClass("popup-open")

            this.countGoods = product["min_buy"]
            this.discountPercent = 0

            $popup.find("#discount_code").val("")

            this.sumAmount = this.generateSum(
                product["min_buy"],
                product["price"],
            )

            $("#overlay, .choose_popup").fadeIn("slow")

            if (isiShop.variables.storage.getItem("lastorder") != null) {
                $("#btn-window").show()
            }

            return false
        },
        generateSum(count, price) {
            if (count > this.currentProduct["count_positions"]) {
                $(".choose_popup #currency").hide()
                return "Такого кол-ва товара нет"
            } else {
                var sum = price * count
                var sum = this.generateSumDiscount(sum)

                return Math.ceil(sum * 100) / 100
            }
        },
        generateSumDiscount(sum) {
            if (this.discountPercent > 0) {
                sum = sum - (sum / 100) * this.discountPercent
            }

            return sum
        },
        validateEmail(email) {
            var re =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        },
    },
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

            discountPercent: 0, // Если пользователь применил промокод, то здесь будет значение процента скидки
            currentProduct: null, // Выбраный продукт для покупки
            sumAmount: null, // Сумма покупки, с учётом скидки
            currencySymbol: getCurrencySymbol(this.shop["currency"]),
            user: null,
            purchase: null,
            products: [],
            categories: [],
        }
    },
    watch: {
        countGoods(newValue, oldValue) {
            this.sumAmount = this.generateSum(
                newValue,
                this.currentProduct["price"],
            )
        },
    },
}
</script>
