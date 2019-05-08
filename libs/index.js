import Vue from 'vue'
import JQuery from 'jquery'
import Toasted from 'vue-toasted'
import datePicker from 'vue-bootstrap-datetimepicker'
import vueCustomElement from 'vue-custom-element'

// vue components
import upload from './_upload'
import uploadMultiple from './_upload-multiple'
import toasts from './_toasts'
import ckeditor from './_ckeditor'
import datepickerBootstrap4 from './_datepicker-bootstrap4'
import selectVSelect from './_select-vselect'

JQuery.extend(true, JQuery.fn.datetimepicker.defaults, {
  icons: {
    time: 'far fa-clock',
    date: 'far fa-calendar',
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    previous: 'fas fa-chevron-left',
    next: 'fas fa-chevron-right',
    today: 'fas fa-calendar-check',
    clear: 'far fa-trash-alt',
    close: 'far fa-times-circle'
  }
})

// register plugin
Vue.use(Toasted, {
  iconPack: 'fontawesome',
  action: {
    text: 'CLOSE',
    onClick: (e, toastObject) => toastObject.goAway(0)
  }
})
Vue.use(vueCustomElement)
Vue.use(datePicker)

// custom custom element list
const customElements = {
  'paw-upload': upload,
  'paw-upload-multiple': uploadMultiple,
  'paw-toasts': toasts,
  'paw-ckeditor': ckeditor,
  'paw-datepicker-bootstrap4': datepickerBootstrap4,
  'paw-select-vselect': selectVSelect
}

// register custom element
Object.entries(customElements).forEach(entry => {
  const handler = entry[0]
  const customElement = entry[1]
  Vue.customElement(handler, customElement)
})
