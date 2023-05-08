import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VueLazyComponent from '@xunlei/vue-lazy-component'

// 关闭生产提示
Vue.config.productionTip = false

// Using plugin
Vue.use(VueLazyComponent)

// 创建Vue
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
