import axios from "axios"

class Client {
    endpoint = "https://tippisell.xyz"

    constructor(shopId = null) {
        this.shopId = shopId
    }

    makeUrl(path) {
        return this.endpoint + path
    }

    async parseAllData(path, params = null) {
        const url = this.makeUrl(path)
        const response = await axios.get(url, { params: params })

        const records = response.data.result.data

        const totalCount = response.data.result.total_count
        let offset = records.length

        const requiredCountRequest = Math.ceil(
            (totalCount - offset) / params.limit,
        )
        const promises = []

        for (let i = 0; i < requiredCountRequest; i += 1) {
            /* eslint no-param-reassign: "error" */
            params.offset = offset
            promises.push(axios.get(url, { params: params }))

            offset += params.limit
        }

        const responses = await Promise.all(promises)

        for (let i = 0; i < responses.length; i += 1) {
            const element = responses[i]
            records.push(...element.data.result.data)
        }

        return records
    }

    async getAllProducts() {
        const response = await this.parseAllData("/api/v2/product/all", {
            shop_id: this.shopId,
            with_count_positions: true,
            limit: 100,
        })
        return response
    }

    async getAllCategories() {
        const response = await this.parseAllData("/api/v2/category/all", {
            shop_id: this.shopId,
            limit: 100,
        })
        return response
    }

    async getShopBySubdomain(subdomain) {
        const url = this.makeUrl(`/api/v2/shop/get-by-subdomain/${subdomain}`)
        const response = await axios.get(url)
        return response.data.result
    }

    async getShopByUUID(uuid) {
        const url = this.makeUrl(`/api/v2/shop/get-by-uuid/${uuid}`)
        const response = await axios.get(url)
        return response.data.result
    }

    async getOrNoneCoupon(code) {
        const url = this.makeUrl("/api/coupon")

        const params = { params: { coupon_code: code, shop_id: this.shopId } }
        const response = await axios.get(url, params)
        return response.data
    }

    async getOrCreateUserByEmail(email) {
        const url = this.makeUrl(`/api/v2/user/get-or-create-by-email/${email}`)
        const response = await axios.post(url, { shop_id: this.shopId })
        return response.data.result
    }

    async createCryptoBotInvoice(userId, amount) {
        const url = this.makeUrl(
            `/api/v2/shop/${this.shopId}/create-crypto-bot-invoice`,
        )
        const response = await axios.post(url, {
            user_id: userId,
            amount: amount,
        })
        return response.data.result
    }

    async createAAIOInvoice(userId, amount) {
        const url = this.makeUrl(
            `/api/v2/shop/${this.shopId}/create-aaio-invoice`,
        )
        const response = await axios.post(url, {
            user_id: userId,
            amount: amount,
        })
        return response.data.result
    }

    async checkAAIOInvoice(userId, invoiceId) {
        const url = this.makeUrl(
            `/api/v2/shop/${this.shopId}/check-aaio-invoice`,
        )
        const params = { params: { user_id: userId, invoice_id: invoiceId } }
        const response = await axios.get(url, params)
        return response.data.result
    }

    async createCrystalPayInvoice(userId, amount) {
        const url = this.makeUrl(
            `/api/v2/shop/${this.shopId}/create-crystal-pay-invoice`,
        )
        const response = await axios.post(url, {
            user_id: userId,
            amount: amount,
        })
        return response.data.result
    }

    async purchaseProcess(userId, productId, count) {
        const url = this.makeUrl(`/api/v2/shop/${this.shopId}/purchase-process`)

        const payload = {
            shop_id: this.shopId,
            user_id: userId,
            product_id: productId,
            count: count,
        }
        const response = await axios.post(url, payload)
        return response.data.result
    }
}

export { Client }
