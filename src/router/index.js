import Vue from 'vue'
import Router from 'vue-router'
import Oauth from './Oauth'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  scrollBehavior () {
    return {x: 0, y: 0}
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/Home/home.vue')
    },
    {
      path: '/entry',
      name: 'entry',
      component: () => import('../pages/Entry/entry.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../pages/User/User.vue')
    },
    {
      path: '/user/edit',
      name: 'user.edit',
      component: () => import('../pages/User/Edit.vue')
    },
    {
      path: '/moment',
      name: 'moment',
      component: () => import('../pages/Moment/Moment.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../pages/Search/Search.vue')
    },
    {
      path: '*',
      name: '404',
      component: () => import('../pages/notFound.vue')
    }
  ]
})

router.beforeEach(Oauth)

export default router
