import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VistaLogin from '@/views/LoginView.vue';
import AppLayout from '@/layout/AppLayout.vue';
import Categoria from '@/views/admin/Categoria.vue';
import Clase from '@/views/admin/Clase.vue';
import Producto from '@/views/admin/Producto.vue';
import Servicio from '@/views/admin/Servicio.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: VistaLogin,
      // Redireccionar si ya esta autenticado
      meta: {redirectIfAuth: true}
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
          meta: {requireAuth: true}
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
          meta: {requireAuth: true}
        },
        {
          path: '/categoria',
          name: 'Categoria',
          component: Categoria,
          meta: {requireAuth: true}
        },
        {
          path: '/clase',
          name: 'Clase',
          component: Clase,
          meta: {requireAuth: true}
        },
        {
          path: '/producto',
          name: 'Producto',
          component: Producto,
          meta: {requireAuth: true}
        },
        {
          path: '/servicio',
          name: 'Servicio',
          component: Servicio,
          meta: {requireAuth: true}
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) =>{
  let token = localStorage.getItem("access_token")
  console.log(to)
  if(to.meta.requireAuth){
    if(!token)
      return next({name: 'login'});
    return next()
  }
  if(to.meta.redirectIfAuth && token){
    return next({name: 'about'})
  }
  return next()
})

export default router
