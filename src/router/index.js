import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LandingPage from '@/views/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/start',
      name: 'landing-pages',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/',
      redirect: '/start'
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login' && localStorage.getItem('token')) {
    next({ name: 'home' })
  } else if (to.name !== 'login' && to.name !== 'landing-pages' && !localStorage.getItem('token')) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
