import { ref, computed } from 'vue'
import type { Cart, EventParticipant } from '../types'
import {
  addToCart,
  checkoutCart,
  fetchCart,
  removeCartItem,
} from '../services/api'
import { useAuth } from './useAuth'

export function useCart() {
  const { getToken } = useAuth()
  const items = ref<Cart[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() => items.value.length)

  const normalizeItems = (carts: Cart[]) => {
    const byEvent = new Map<number, Cart>()
    for (const item of carts) {
      if (!byEvent.has(item.event_id)) {
        byEvent.set(item.event_id, { ...item, quantity: 1 })
      }
    }
    return Array.from(byEvent.values())
  }

  const requireToken = () => {
    const token = getToken()
    if (!token) {
      throw Object.assign(new Error('Not authenticated'), { status: 401 })
    }
    return token
  }

  const load = async () => {
    isLoading.value = true
    error.value = null
    try {
      items.value = normalizeItems(await fetchCart(requireToken()))
    } catch (err: any) {
      error.value = err?.data || err?.message || 'Failed to load cart'
    } finally {
      isLoading.value = false
    }
  }

  const add = async (eventId: number) => {
    const token = requireToken()
    if (items.value.length === 0) {
      items.value = normalizeItems(await fetchCart(token))
    }
    const alreadyInCart = items.value.find(item => item.event_id === eventId)
    if (alreadyInCart) return alreadyInCart

    const cart = await addToCart({ event_id: eventId, quantity: 1 }, token)
    const existing = items.value.findIndex(i => i.event_id === cart.event_id)
    if (existing >= 0) items.value[existing] = { ...cart, quantity: 1 }
    else items.value.push(cart)
    return cart
  }

  const remove = async (cartId: number) => {
    const token = requireToken()
    await removeCartItem(cartId, token)
    items.value = items.value.filter(i => i.id !== cartId)
  }

  const checkout = async (): Promise<{ enrolled: EventParticipant[]; skipped: Array<{ event_id: number; reason: string }> }> => {
    const token = requireToken()
    const result = await checkoutCart(token)
    items.value = []
    return result
  }

  return {
    items,
    isLoading,
    error,
    itemCount,
    load,
    add,
    remove,
    checkout,
  }
}
