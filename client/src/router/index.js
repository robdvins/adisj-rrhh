import Vue from 'vue';
import VueRouter from 'vue-router';
import { decode } from 'jsonwebtoken';
import employeeRoutes from '@/router/employee.js';
import permitRoutes from '@/router/permit.js';
import overtimeRoutes from '@/router/overtime.js';
import spreadsheetRoutes from '@/router/spreadsheet.js';
import tasksRoutes from '@/router/tasks.js';
import vactionsRoutes from '@/router/vacations.js';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: { name: 'dashboard' } },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Inicio de sesión | Adisj',
      requiresAuth: false,
      adminOnly: false,
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginUser.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'Inicio | Adisj', requiresAuth: true, adminOnly: false },
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    meta: { title: 'Mi perfil | Adisj', requiresAuth: true, adminOnly: false },
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
  },
  {
    path: '/calificar-servicio',
    name: 'vote',
    meta: { title: 'Calificar servicio | Adisj', requiresAuth: false },
    component: () => import(/* webpackChunkName: "vote" */ '../views/Vote.vue'),
  },
  {
    path: '/control-calidad',
    name: 'quality-control',
    meta: { title: 'Control de calidad | Adisj', requiresAuth: true, adminOnly: true },
    component: () => import(/* webpackChunkName: "vote" */ '../views/QualityControl.vue'),
  },
  {
    path: '/amonestaciones',
    name: 'warnings',
    meta: { title: 'Amonestaciones | Adisj', requiresAuth: true },
    component: () => import(/* webpackChunkName: "warnings" */ '../views/Warnings.vue'),
  },
  {
    path: '/felicitaciones',
    name: 'congrats',
    meta: { title: 'Felicitaciones | Adisj', requiresAuth: true },
    component: () => import(/* webpackChunkName: "congrats" */ '../views/Congrats.vue'),
  },
  ...employeeRoutes,
  ...permitRoutes,
  ...overtimeRoutes,
  ...spreadsheetRoutes,
  ...tasksRoutes,
  ...vactionsRoutes,
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user');

  //Si la ruta require autorizacion y no esta logueado
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    return next({ name: 'login' });
  }

  //Si la ruta no require autorizacion y esta logueado (Login)
  if (to.matched.some(record => !record.meta.requiresAuth) && loggedIn) {
    document.title = from.meta.title;
    return next({ name: 'dashboard' });
  }

  if (loggedIn) {
    const decodedToken = decode(JSON.parse(loggedIn).token);

    if (decodedToken.tipo_empleado !== 1 && to.matched.some(record => record.meta.adminOnly)) {
      return next({ name: 'dashboard' });
    }
  }

  document.title = to.matched.find(record => record.meta.title).meta.title;
  return next();
});

export default router;
