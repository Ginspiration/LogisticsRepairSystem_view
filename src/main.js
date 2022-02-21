import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

/*elementUI*/
import ElementUI from 'element-ui';

import router from "./router";//引入路由
Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,//应用路由
  render: h => h(App),
}).$mount('#app')

import './config/axios'
Vue.prototype.$ajax = axios