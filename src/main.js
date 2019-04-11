import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import elementUI from 'element-ui'
import viewer from 'v-viewer'

import 'viewerjs/dist/viewer.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'

Vue.use(elementUI)
Vue.use(viewer)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
