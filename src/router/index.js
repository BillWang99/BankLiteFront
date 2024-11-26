import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path:'/accounttypes',
      name:'accounttypes',
      component: () => import('../views/AccountTypes.vue'),
      meta: {
        requiresAuth:true
      }
    },
    {
      path:'/transaction',
      name:'transaction',
      component: ()=> import('../views/Transaction.vue'),
      meta:{
        requiresAuth:true
      }
    },
    {
      path:'/transfer',
      name:'transfer',
      component: ()=> import('../views/Transfer.vue'),
      meta:{
        requiresAuth:true
      }
    },
    {
      path:'/transactionhistory',
      name:'transactionhistory',
      component : ()=> import('../views/TransactionHistory.vue'),
      meta:{
        requiresAuth:true,
      }
    }
  ],
});


router.beforeEach((to, from, next)=>{
  const store = useStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !store.getters.isAuthenticated) { 
    next('/login'); 
    // 如果未登入，重定向到登入頁面 
  } else { 
    next(); // 否則，允許進入 
  }
});

export default router
