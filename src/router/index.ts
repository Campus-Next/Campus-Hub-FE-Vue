import { createRouter, createWebHistory } from 'vue-router'

const getUserData = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

const isAdmin = () => {
  const user = getUserData()
  return user?.is_admin === true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('../pages/user/Welcome.vue')
    },
    {
      path: '/user/register',
      name: 'user-register',
      component: () => import('../pages/user/SignInPeserta.vue')
    },
    {
      path: '/user/login',
      name: 'user-login',
      component: () => import('../pages/user/LoginPeserta.vue')
    },
    {
      path: '/',
      name: 'home',
      component: () => isAdmin() 
        ? import('../pages/admin/HomePage.vue')
        : import('../pages/user/HomePage.vue')
    },
    {
      path: '/webinar',
      name: 'webinar',
      component: () => import('../pages/user/Webinar.vue')
    },
    {
      path: '/seminar',
      name: 'seminar',
      component: () => import('../pages/user/Seminar.vue')
    },
    {
      path: '/kuliah-tamu',
      name: 'kuliah-tamu',
      component: () => import('../pages/user/KuliahTamu.vue')
    },
    {
      path: '/workshop',
      name: 'workshop',
      component: () => import('../pages/user/Workshop.vue')
    },
    {
      path: '/sertifikasi',
      name: 'sertifikasi',
      component: () => import('../pages/user/Sertifikasi.vue')
    },
    {
      path: '/public-events',
      name: 'public-events',
      component: () => import('../pages/user/PublicEvents.vue')
    },
    {
      path: '/events/upload',
      name: 'upload-event',
      component: () => import('../pages/admin/UploadEvent.vue')
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../pages/admin/LoginAdmin.vue')
    },
    {
      path: '/my-events',
      name: 'my-events',
      component: () => isAdmin()
        ? import('../pages/admin/MyEvents.vue')
        : import('../pages/user/MyEvents.vue')
    },
    {
      path: '/account/profile',
      name: 'profile',
      component: () => import('../pages/user/ProfilePage.vue')
    },
    {
      path: '/account/password',
      name: 'password',
      component: () => import('../pages/user/ProfilePagePassword.vue')
    },
    {
      path: '/my-events/:id/view',
      name: 'my-event-status',
      component: () => import('../pages/user/MyEventStatusPage.vue')
    },
    {
      path: '/events/:id/preview',
      name: 'preview-event',
      component: () => import('../pages/user/PreviewEvent.vue')
    },
    {
      path: '/events/:id/view',
      name: 'detail-event',
      component: () => import('../pages/user/DetailEvent.vue')
    },
    {
      path: '/my-events/:id/kode-unik',
      name: 'kode-unik',
      component: () => import('../pages/user/KodeUnik.vue')
    },
    {
      path: '/events/preview',
      name: 'admin-preview',
      component: () => import('../pages/admin/PreviewPage.vue')
    },
    {
      path: '/my-events/:id/participants',
      name: 'participants',
      component: () => import('../pages/admin/MyParticipants.vue')
    },
    {
      path: '/my-events/:id/edit',
      name: 'edit-event',
      component: () => import('../pages/admin/EditEvent.vue')
    },
    {
      path: '/my-events/:id/preview',
      name: 'preview-edit',
      component: () => import('../pages/admin/PreviewEdit.vue')
    },
    {
      path: '/my-events/:id/check-in',
      name: 'check-in',
      component: () => import('../pages/admin/CheckInPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error',
      component: () => import('../pages/user/ErrorPage.vue')
    }
  ]
})

export default router
