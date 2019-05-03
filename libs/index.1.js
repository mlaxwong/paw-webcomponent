import Vue from 'vue'
import Toasted from 'vue-toasted'
import vueCustomElement from 'vue-custom-element'

// register plugin
Vue.use(Toasted, {
  iconPack: 'fontawesome',
  action: {
    text: 'CLOSE',
    onClick: (e, toastObject) => toastObject.goAway(0)
  }
})
Vue.use(vueCustomElement)

// register to global
window.Vue = Vue

// vue web component
require('./vue-web-component')
