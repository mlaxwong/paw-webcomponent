<template></template>

<script>
import Vue from 'vue'

export default {
  props: ['items'],
  mounted () {
    const items = JSON.parse(this.items)
    let fadeDelay = 0
    for (const key in items) {
      const item = items[key]
      const icon = item.hasOwnProperty('icon') ? item.icon : null
      const duration = item.hasOwnProperty('duration') ? item.duration : 5000
      // const className = item.hasOwnProperty('className') ? item.className : null
      // const type = item.hasOwnProperty('type') ? item.type : null
      // console.log(className)
      Vue.toasted.show(item.message, {
        icon
        // className
        // type
      }).goAway(duration + fadeDelay)
      fadeDelay += 250
    }
  }
}
</script>
