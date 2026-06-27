import Home from './components/Home.js';
import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';

// 1. Reactive Global Store for Admin Sessions
export const store = Vue.reactive({
  isAdmin: localStorage.getItem('isLoggedIn') === 'true',
  adminUsername: localStorage.getItem('admin_user') || '',
  setLogin(username, token) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', username);
    this.isAdmin = true;
    this.adminUsername = username;
  },
  clearLogin() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.isAdmin = false;
    this.adminUsername = '';
  }
});

// 2. Global Axios Configurations
axios.defaults.baseURL = window.API_BASE_URL || 'http://localhost:8080';

// Axios Request Interceptor (Inject Authorization Bearer Token)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Axios Response Interceptor (Catch 401 Unauthorized globally)
axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    store.clearLogin();
    if (window.appInstance) {
      window.appInstance.addToast("Sesi kedaluwarsa atau dilarang! Hak administrator dicabut.", "error");
    }
    router.push('/login');
  }
  return Promise.reject(error);
});

// 3. SPA Routing Definition
const routes = [
  { path: '/', component: Home, name: 'home' },
  { path: '/login', component: Login, name: 'login' },
  { 
    path: '/admin', 
    component: Dashboard, 
    name: 'admin',
    meta: { requiresAuth: true }
  }
];

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

// Navigation Guard (Client-side Security)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.isAdmin) {
    if (window.appInstance) {
      window.appInstance.addToast("Harap login terlebih dahulu untuk mengakses dashboard admin.", "warn");
    }
    next('/login');
  } else {
    next();
  }
});

// 4. Create and mount Vue application
const app = Vue.createApp({
  data() {
    return {
      toasts: [],
      sharedStore: store
    };
  },
  computed: {
    isAdmin() {
      return this.sharedStore.isAdmin;
    },
    adminUsername() {
      return this.sharedStore.adminUsername;
    }
  },
  methods: {
    goHome() {
      router.push('/');
    },
    openLogin() {
      router.push('/login');
    },
    logout() {
      this.sharedStore.clearLogin();
      this.addToast("Anda telah keluar dari akses administrator.", "info");
      router.push('/');
    },
    addToast(message, type = 'success') {
      const id = Date.now().toString();
      this.toasts.push({ id, message, type });
      setTimeout(() => this.removeToast(id), 4000);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },
    getToastBg(type) {
      switch (type) {
        case 'success': return 'bg-neo-green';
        case 'warn': return 'bg-neo-yellow';
        case 'error': return 'bg-neo-orange';
        case 'info': return 'bg-neo-teal';
        default: return 'bg-white';
      }
    },
    getToastText(type) {
      return (type === 'warn' || type === 'info') ? 'text-black' : 'text-white';
    }
  },
  mounted() {
    // Expose app instance to window for global access (interceptors)
    window.appInstance = this;
  }
});

app.use(router);
app.mount('#app');
