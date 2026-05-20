<template>
  <div class="font-sans flex flex-col box-border w-full min-h-screen">
    <Navbar />

    <div class="container mx-auto px-4 sm:px-6 lg:px-20 pt-10">
      <div class="breadcrumb flex ml-2 pb-6 text-medium">
        <ol class="list-none flex text-black">
          <li><router-link to="/" class="hover:underline">Home</router-link></li>
          <li class="mx-2">&gt;</li>
          <li class="text-gray-500">Keranjang</li>
        </ol>
      </div>

      <h1 class="font-bold text-[32px] sm:text-[24px] pb-6">Keranjang Saya</h1>

      <LoadingSpinner v-if="isLoading" fullScreen />

      <ErrorMessage v-else-if="error" :message="error" />

      <div v-else-if="items.length === 0" class="bg-white rounded-2xl shadow-md p-10 text-center">
        <i class="ri-shopping-cart-2-line text-6xl text-gray-300" />
        <h2 class="text-2xl font-semibold mt-4">Keranjang kamu masih kosong</h2>
        <p class="text-gray-500 mt-2">Tambahkan acara dari halaman detail untuk mulai mendaftar.</p>
        <router-link
          to="/"
          class="inline-block mt-6 bg-[#027FFF] hover:bg-[#0066CC] text-white font-medium px-8 h-11 leading-[44px] rounded-lg transition-colors"
        >
          Jelajahi Acara
        </router-link>
      </div>

      <div v-else class="content-box flex flex-col lg:flex-row gap-8">
        <div class="cart-items flex-1 flex flex-col gap-4">
          <div
            v-for="item in items"
            :key="item.id"
            class="cart-item p-4 border border-[#027FFF] rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col sm:flex-row gap-4 sm:items-center"
          >
            <img
              :src="getEventImageUrl(item.event)"
              alt="Event"
              class="w-24 h-24 object-cover rounded-xl"
            />
            <div class="flex-1 flex flex-col">
              <h3 class="font-semibold text-lg">{{ item.event?.title || 'Untitled Event' }}</h3>
              <span class="text-sm text-gray-500" v-if="item.event?.start_date">
                {{ new Date(item.event.start_date).toLocaleDateString('id-ID') }}
              </span>
              <span class="text-sm text-gray-500" v-if="item.event?.location">
                {{ item.event.location }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                class="w-9 h-9 rounded-lg border border-[#027FFF] text-[#027FFF] hover:bg-[#EAF4FF] transition disabled:opacity-50"
                :disabled="item.quantity <= 1 || updatingId === item.id"
                @click="changeQuantity(item, item.quantity - 1)"
              >
                <i class="ri-subtract-line" />
              </button>
              <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
              <button
                class="w-9 h-9 rounded-lg border border-[#027FFF] text-[#027FFF] hover:bg-[#EAF4FF] transition disabled:opacity-50"
                :disabled="updatingId === item.id"
                @click="changeQuantity(item, item.quantity + 1)"
              >
                <i class="ri-add-line" />
              </button>
            </div>

            <button
              class="text-red-500 hover:text-red-700 transition self-end sm:self-center"
              :disabled="removingId === item.id"
              @click="removeItem(item)"
              aria-label="Hapus dari keranjang"
            >
              <i class="ri-delete-bin-line text-3xl" />
            </button>
          </div>
        </div>

        <div class="summary w-full lg:w-4/12 h-fit bg-white shadow-lg rounded-2xl p-6 flex flex-col">
          <h2 class="font-semibold text-[20px] mb-4">Ringkasan Pendaftaran</h2>
          <div class="flex justify-between text-sm mb-2">
            <span>Jumlah Acara</span>
            <span>{{ itemCount }}</span>
          </div>
          <div class="border-b-2 border-[#003266] w-full my-2" />
          <button
            class="bg-[#027FFF] hover:bg-[#0066CC] disabled:bg-[#A2A2A2] disabled:cursor-not-allowed font-medium w-full h-11 mt-4 rounded-lg text-white text-[16px] transition-colors"
            :disabled="isCheckingOut || items.length === 0"
            @click="onCheckout"
          >
            {{ isCheckingOut ? 'Memproses...' : 'Konfirmasi Pendaftaran' }}
          </button>
        </div>
      </div>
    </div>

    <PopUpBerhasil
      v-if="showSuccess"
      :is-visible="showSuccess"
      :message="successMessage"
      @close="closeSuccess"
    />
    <PopUpGagal
      v-if="showError"
      :is-visible="showError"
      :message="errorMessage"
      @close="showError = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import ErrorMessage from '../../components/ErrorMessage.vue'
import PopUpBerhasil from '../../components/PopUpBerhasil.vue'
import PopUpGagal from '../../components/PopUpGagal.vue'
import { useCart } from '../../composables/useCart'
import { useAuthCheck } from '../../composables/useAuthCheck'
import { getEventImageUrl } from '../../utils/helpers'
import type { Cart as CartItem } from '../../types'

const router = useRouter()
const { items, isLoading, error, itemCount, total, load, update, remove, checkout } = useCart()

const updatingId = ref<number | null>(null)
const removingId = ref<number | null>(null)
const isCheckingOut = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

useAuthCheck()

const formatPrice = (value: string | number | undefined | null) => {
  const num = Number(value ?? 0)
  if (num === 0) return 'Gratis'
  return `Rp ${num.toLocaleString('id-ID')}`
}

const changeQuantity = async (item: CartItem, quantity: number) => {
  if (quantity < 1) return
  updatingId.value = item.id
  try {
    await update(item.id, quantity)
  } catch (err: any) {
    errorMessage.value = err?.data || err?.message || 'Gagal memperbarui keranjang'
    showError.value = true
  } finally {
    updatingId.value = null
  }
}

const removeItem = async (item: CartItem) => {
  removingId.value = item.id
  try {
    await remove(item.id)
  } catch (err: any) {
    errorMessage.value = err?.data || err?.message || 'Gagal menghapus item'
    showError.value = true
  } finally {
    removingId.value = null
  }
}

const onCheckout = async () => {
  isCheckingOut.value = true
  try {
    const result = await checkout()
    const enrolledCount = result.enrolled?.length ?? 0
    const skippedCount = result.skipped?.length ?? 0
    successMessage.value = skippedCount === 0
      ? `Berhasil mendaftar ke ${enrolledCount} acara`
      : `${enrolledCount} acara berhasil terdaftar, ${skippedCount} dilewati`
    showSuccess.value = true
  } catch (err: any) {
    errorMessage.value = err?.data || err?.message || 'Pendaftaran gagal'
    showError.value = true
  } finally {
    isCheckingOut.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
  router.push('/my-events')
}

onMounted(() => {
  window.scrollTo(0, 0)
  load()
})
</script>
