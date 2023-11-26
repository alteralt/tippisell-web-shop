import axios from "axios"

export class Client {
    endpoint = "https://tippisell.xyz"

    constructor(shopId = null) {
        this.shopId = shopId
    }

    makeUrl(path) {
        return this.endpoint + path
    }

    async parseAllData(path, params = null) {
        var records = []

        var offset = 0
        while (true) {
            let url = this.makeUrl(path)
            let response = await axios.get(url, { params: params })

            let result = response.data["result"]

            for (let i = 0; i < result["data"].length; i++) {
                let element = result["data"][i]
                records.push(element)
            }

            if (result["total_count"] == records.length) break

            offset += result["data"].length
        }

        return records
    }

    async getAllProducts() {
        return await this.parseAllData("/api/v2/product/all", {
            shop_id: this.shopId,
            with_count_positions: true,
        })
    }

    async getAllCategories() {
        return await this.parseAllData("/api/v2/category/all", {
            shop_id: this.shopId,
        })
    }

    async getShopBySubdomain(subdomain) {
        let url = this.makeUrl("/api/v2/shop/get-by-subdomain/" + subdomain)
        var response = await axios.get(url)
        return response.data["result"]
    }

    async getOrNoneCoupon(code) {
        let url = this.makeUrl("/api/coupon")

        var params = { params: { coupon_code: code, shop_id: this.shopId } }
        var response = await axios.get(url, params)
        return response.data
    }

    async getOrCreateUserByEmail(email) {
        var url = this.makeUrl("/api/v2/user/get-or-create-by-email/" + email)
        var response = await axios.post(url, { shop_id: this.shopId })
        return response.data["result"]
    }

    async createCryptoBotInvoice(userId, amount, coin) {
        let url = this.makeUrl(
            "/api/v2/shop/" + this.shopId + "/create-crypto-bot-invoice",
        )
        var response = await axios.post(url, {
            user_id: userId,
            amount: amount,
            coin: coin,
        })
        return response.data["result"]
    }

    async createAAIOInvoice(userId, amount) {
        let url = this.makeUrl(
            "/api/v2/shop/" + this.shopId + "/create-aaio-invoice",
        )
        var response = await axios.post(url, {
            user_id: userId,
            amount: amount,
        })
        return response.data["result"]
    }

    async checkAAIOInvoice(userId, invoiceId) {
        let url = this.makeUrl(
            "/api/v2/shop/" + this.shopId + "/check-aaio-invoice",
        )
        var params = { params: { user_id: userId, invoice_id: invoiceId } }
        var response = await axios.get(url, params)
        return response.data["result"]
    }

    async createCrystalPayInvoice(userId, amount) {
        let url = this.makeUrl(
            "/api/v2/shop/" + this.shopId + "/create-crystal-pay-invoice",
        )
        var response = await axios.post(url, {
            user_id: userId,
            amount: amount,
        })
        return response.data["result"]
    }

    async purchaseProcess(userId, productId, count) {
        let url = this.makeUrl(
            "/api/v2/shop/" + this.shopId + "/purchase-process",
        )

        var payload = {
            shop_id: this.shopId,
            user_id: userId,
            product_id: productId,
            count: count,
        }
        var response = await axios.post(url, payload)
        return response.data["result"]
    }
}
