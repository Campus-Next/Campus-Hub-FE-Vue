<template>
  <component :is="homeComponent" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminHomePage from './admin/HomePage.vue'
import UserHomePage from './user/HomePage.vue'
import { AUTH_SESSION_EVENT, isAdmin } from '../utils/authSession'

const route = useRoute()
const authVersion = ref(0)

const refreshAuth = () => {
  authVersion.value++
}

const homeComponent = computed(() => {
  route.fullPath
  authVersion.value
  return isAdmin() ? AdminHomePage : UserHomePage
})

onMounted(() => {
  window.addEventListener(AUTH_SESSION_EVENT, refreshAuth)
})

onUnmounted(() => {
  window.removeEventListener(AUTH_SESSION_EVENT, refreshAuth)
})
</script>
