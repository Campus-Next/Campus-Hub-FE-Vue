import { ref, computed } from 'vue'
import type { Cart, EventParticipant } from '../types'
import {
  addToCart,
  checkoutCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from '../services/api'
import { useAuth } from './useAuth'

export function useCart() {
  const { getToken } = useAuth()
  const items = ref<Cart[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + (item.quantity || 0), 0),
  )

  const total = computed(() =>
    items.value.reduce((sum, item) => {
      const fee = Number(item.event?.registration_fee ?? 0)
      return sum + fee * item.quantity
    }, 0),
  )

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
      items.value = await fetchCart(requireToken())
    } catch (err: any) {
      error.value = err?.data || err?.message || 'Failed to load cart'
    } finally {
      isLoading.value = false
    }
  }

  const add = async (eventId: number, quantity = 1) => {
    const token = requireToken()
    const cart = await addToCart({ event_id: eventId, quantity }, token)
    const existing = items.value.findIndex(i => i.id === cart.id)
    if (existing >= 0) items.value[existing] = cart
    else items.value.push(cart)
    return cart
  }

  const update = async (cartId: number, quantity: number) => {
    const token = requireToken()
    const cart = await updateCartItem(cartId, { quantity }, token)
    const index = items.value.findIndex(i => i.id === cartId)
    if (index >= 0) items.value[index] = { ...items.value[index], ...cart }
    return cart
  }

  const remove = async (cartId: number) => {
    const token = requireToken()
    await removeCartItem(cartId, token)
    items.value = items.value.filter(i => i.id !== cartId)
  }

  const checkout = async (): Promise<{ enrolled: EventParticipant[]; skipped: Array<{ event_id: number; reason: string }> }> => {
    const token = requireToken()
    const result = await checkoutCart(token) as unknown as {
      enrolled: EventParticipant[]
      skipped: Array<{ event_id: number; reason: string }>
    }
    items.value = []
    return result
  }

  return {
    items,
    isLoading,
    error,
    itemCount,
    total,
    load,
    add,
    update,
    remove,
    checkout,
  }
}
