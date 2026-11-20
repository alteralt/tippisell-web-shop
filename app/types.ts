export interface Shop {
    id: number
    web: boolean
    web_background: string
    web_favicon: string
    web_telegram_bot_link: boolean
    web_title: string
    bot_username: string
    web_shop_rules: string | null
    is_premium: boolean
    hide_empty_products: boolean
    currency: "rub" | "usd"
    payment_methods: string[]
}

export interface Category {
    id: number
    name: string
    description: string
    parent_id: number | null
}

export interface Product {
    id: number
    name: string
    description: string
    type: "text" | "file"
    price: number
    category_id: number | null
    min_buy: number
    max_buy: number
    is_infinitely: boolean
    count_positions: number | null
}

export interface User {
    id: number
    balance: number
}

export interface Invoice {
    url: string
    invoice_id: string
}

export interface Purchase {
    download_url: string | null
}

export interface Coupon {
    percent: number
}
