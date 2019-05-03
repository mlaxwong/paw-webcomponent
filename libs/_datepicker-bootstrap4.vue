<template>
  <div class="vue-bootstrap-datetimepicker-wrapper">
    <date-picker v-model="datetime" :config="options" :placeholder="placeholder"></date-picker>
    <input type="hidden" :name="this.$props.name" :value="hiddenValue" />
  </div>
</template>

<script>
import datePicker from 'vue-bootstrap-datetimepicker'
import moment from 'moment-timezone'
export default {
  props: ['format', 'name', 'config', 'value', 'placeholder'],
  mounted () {
    const format = this.$props.format || 'YYYY/MM/DD hh:mm a'
    this.options['format'] = format
    this.datetime = this.$props.value ? moment(this.$props.value) : null
  },
  data () {
    return {
      datetime: null,
      options: {
        format: false,
        useCurrent: false,
        showClear: true,
        showClose: true
      }
    }
  },
  components: {
    datePicker
  },
  computed: {
    hiddenValue: function () {
      return this.datetime ? moment(this.datetime)
        .format() : null
    }
  }
}
</script>

<style lang="scss">
paw-datepicker-bootstrap4 {
  &.form-control {
    padding: 0px;
  }

  .form-control {
    border: none;
    height: auto;
  }
  
  .vue-bootstrap-datetimepicker-wrapper {
    position: relative;
  }
}
</style>


