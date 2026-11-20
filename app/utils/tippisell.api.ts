import type {
    Category,
    Coupon,
    Invoice,
    Product,
    Purchase,
    Shop,
    User,
} from "~/types"

type Query = Record<string, string | number | boolean | null>

type ApiResponse<T> = { result: T }

type ListResult<T> = { data: T[]; total_count: number }

class TippisellClient {
    shopId: number | null

    constructor(shopId: number | null = null) {
        this.shopId = shopId
    }

    async get<T>(path: string, query: Query = {}): Promise<T> {
        const response = await $fetch<ApiResponse<T>>(path, {
            baseURL: TIPPISELL_URL,
            query,
        })
        return response.result
    }

    async post<T>(path: string, body: Record<string, unknown>): Promise<T> {
        const response = await $fetch<ApiResponse<T>>(path, {
            baseURL: TIPPISELL_URL,
            method: "POST",
            body,
        })
        return response.result
    }

    async parseAllData<T>(
        path: string,
        query: Query & { limit: number },
    ): Promise<T[]> {
        const result = await this.get<ListResult<T>>(path, query)

        const records = result.data
        let offset = records.length

        const requiredCountRequest = Math.ceil(
            (result.total_count - offset) / query.limit,
        )
        const promises = []

        for (let i = 0; i < requiredCountRequest; i += 1) {
            promises.push(this.get<ListResult<T>>(path, { ...query, offset }))

            offset += query.limit
        }

        for (const page of await Promise.all(promises)) {
            records.push(...page.data)
        }

        return records
    }

    async getAllProducts() {
        return await this.parseAllData<Product>("/api/v2/product/all", {
            shop_id: this.shopId,
            with_count_positions: true,
            limit: 100,
        })
    }

    async getAllCategories() {
        return await this.parseAllData<Category>("/api/v2/category/all", {
            shop_id: this.shopId,
            limit: 100,
        })
    }

    async getShopBySubdomain(subdomain: string) {
        return await this.get<Shop>(
            `/api/v2/shop/get-by-subdomain/${subdomain}`,
        )
    }

    async getShopByUUID(uuid: string) {
        return await this.get<Shop>(`/api/v2/shop/get-by-uuid/${uuid}`)
    }

    async getOrNoneCoupon(code: string) {
        return await $fetch<Coupon>("/api/coupon", {
            baseURL: TIPPISELL_URL,
            query: { coupon_code: code, shop_id: this.shopId },
        })
    }

    async getOrCreateUserByEmail(email: string) {
        return await this.post<User>(
            `/api/v2/user/get-or-create-by-email/${email}`,
            { shop_id: this.shopId },
        )
    }

    async createCryptoBotInvoice(userId: number, amount: number) {
        return await this.post<Invoice>(
            `/api/v2/shop/${this.shopId}/create-crypto-bot-invoice`,
            { user_id: userId, amount: amount },
        )
    }

    async createAAIOInvoice(userId: number, amount: number) {
        return await this.post<Invoice>(
            `/api/v2/shop/${this.shopId}/create-aaio-invoice`,
            { user_id: userId, amount: amount },
        )
    }

    async checkAAIOInvoice(userId: number, invoiceId: string) {
        return await this.get<boolean>(
            `/api/v2/shop/${this.shopId}/check-aaio-invoice`,
            { user_id: userId, invoice_id: invoiceId },
        )
    }

    async createCrystalPayInvoice(userId: number, amount: number) {
        return await this.post<Invoice>(
            `/api/v2/shop/${this.shopId}/create-crystal-pay-invoice`,
            { user_id: userId, amount: amount },
        )
    }

    async purchaseProcess(
        userId: number,
        productId: number,
        count: number | null,
    ) {
        return await this.post<Purchase>(
            `/api/v2/shop/${this.shopId}/purchase-process`,
            {
                shop_id: this.shopId,
                user_id: userId,
                product_id: productId,
                count: count,
            },
        )
    }
}

export { TippisellClient }
