import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueCookies from 'vue-cookies';

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import * as bootstrap from 'bootstrap';

//bootstrap設置為全域
window.bootstrap = bootstrap;

const app = createApp(App)

//宣告api url
app.config.globalProperties.$accountsApi = 'http://banklite.com.tw/api/Accounts';//Accounts
app.config.globalProperties.$accountTypesApi = 'http://banklite.com.tw/api/AccountTypes';//AccountTypes
app.config.globalProperties.$filesApi = 'http://banklite.com.tw/api/Files';//Files
app.config.globalProperties.$loginApi = 'http://banklite.com.tw/api/login';//login
app.config.globalProperties.$transactionsApi = 'http://banklite.com.tw/api/Transactions';//Transactions
app.config.globalProperties.$usersApi = 'http://banklite.com.tw/api/Users';//Users

if (process.env.NODE_ENV === 'production') { app.config.devtools = false; }

app.use(router)
app.use(store)
app.use(VueCookies)

app.mount('#app')
