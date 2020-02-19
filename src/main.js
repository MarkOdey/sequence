import Vue from 'vue'
import VueRouter from 'vue-router'
import VueHead from 'vue-head'

import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BootstrapVue from 'bootstrap-vue'

import './assets/global.scss'

import './assets/index.scss'

Vue.use(VueHead)
Vue.use(VueRouter)

Vue.use(BootstrapVue)

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
