<template>
  <div>
    <tag :is="this.htmlTag" v-for="(value, index) in values" :key="index"></tag>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    tag: {
      type: String,
      default: 'input'
    }
  },
  data () {
    return {
      values: []
    }
  },
  computed: {
    htmlTag: function () {
      return this.$props.tag
    }
  }
}
</script>

