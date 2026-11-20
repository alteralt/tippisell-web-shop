import type { Shop } from "~/types"

export const SHOP_KEY = "shop"

export const TIPPISELL_URL = "https://app.tippisell.cc"

export const useShop = () => useNuxtData<Shop>(SHOP_KEY).data as Ref<Shop>
