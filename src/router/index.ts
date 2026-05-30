import { createRouter, createWebHistory } from 'vue-router'
import { clearAuthSession, isAdmin, isAuthenticated } from '../utils/authSession'

const authRedirect = (path: string) => `/welcome?redirect=${encodeURIComponent(path)}`
const userLoginRedirect = (path: string) => `/user/login?redirect=${encodeURIComponent(path)}`

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../pages/user/Welcome.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/user/register',
      name: 'user-register',
      component: () => import('../pages/user/SignInPeserta.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/user/login',
      name: 'user-login',
      component: () => import('../pages/user/LoginPeserta.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../pages/admin/LoginAdmin.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomeShell.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../pages/user/Cart.vue'),
      meta: { requiresAuth: true, requiresUser: true },
    },
    {
      path: '/events/upload',
      name: 'upload-event',
      component: () => import('../pages/admin/UploadEvent.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/my-events',
      name: 'my-events',
      component: () => isAdmin()
        ? import('../pages/admin/MyEvents.vue')
        : import('../pages/user/MyEvents.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account/profile',
      name: 'profile',
      component: () => import('../pages/user/ProfilePage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account/password',
      name: 'password',
      component: () => import('../pages/user/ProfilePagePassword.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-events/:id/view',
      name: 'my-event-status',
      component: () => import('../pages/user/MyEventStatusPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events/:id/view',
      name: 'detail-event',
      component: () => import('../pages/user/DetailEvent.vue'),
    },
    {
      path: '/my-events/:id/kode-unik',
      name: 'kode-unik',
      component: () => import('../pages/user/KodeUnik.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-events/:id/participants',
      name: 'participants',
      component: () => import('../pages/admin/MyParticipants.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/my-events/:id/edit',
      name: 'edit-event',
      component: () => import('../pages/admin/EditEvent.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/my-events/:id/check-in',
      name: 'check-in',
      component: () => import('../pages/admin/CheckInPage.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('../pages/user/ErrorPage.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const hasSession = isAuthenticated()

  if (to.meta.requiresAuth && !hasSession) {
    clearAuthSession()
    if (to.meta.requiresUser) {
      return userLoginRedirect(to.fullPath)
    }
    return authRedirect(to.fullPath)
  }

  if (to.meta.requiresAdmin && !isAdmin()) {
    return '/'
  }

  if (to.meta.requiresUser && isAdmin()) {
    return '/'
  }

  if (to.meta.guestOnly && hasSession) {
    return '/'
  }

  return true
})

export default router
