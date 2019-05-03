<template>
  <div @keydown.enter="onEnterKey">
    <v-select 
    ref="vselect"
      :class="{focus: isFocus}" 
      :options="this.vselectOptions"
      :label="this.$props.labelKey" 
      :placeholder="this.$props.placeholder" 
      v-model="selected"
      @search:focus="onFocus" 
      @search:blur="onBlur" 
      @input="onInput" 
      ></v-select>
    <input type="hidden" :name="this.$props.name" v-model="selected" />
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
export default {
  props: {
    name: {type: String, default: null},
    items: {type: String, default: null},
    value: {default: null},
    labelKey: {type: String, default: 'label'},
    valueKey: {type: String, default: 'value'},
    placeholder: {type: String, default: null}
  },
  data () {
    return {
      selected: null,
      isFocus: false,
      vselectOptions: []
    }
  },
  mounted () {
    if (this.$props.items) {
      if (typeof this.$props.items === 'string') {
        this.vselectOptions = JSON.parse(this.$props.items)
      }
    }
    this.selected = this.$props.value
  },
  components: {
    'v-select': vSelect
  },
  methods: {
    onEnterKey: function (event) {
      if (this.isFocus) {
        event.preventDefault()
      }
    },
    onFocus: function () {
      this.isFocus = true
    },
    onBlur: function () {
      this.isFocus = false
    },
    onInput: function (item) {
      this.selected = item[this.$props.valueKey] || item
    }
  }
}
</script>

<style lang="scss">
@import '../node_modules/bootstrap/scss/functions.scss';
@import '../node_modules/bootstrap/scss/variables.scss';
@import '../node_modules/bootstrap/scss/mixins.scss';
@import '../node_modules/bootstrap/scss/forms.scss';

.v-select {
  & > div.vs__dropdown-toggle {
    @extend .form-control;
    display: flex;

    .vs__selected-options {
      span.vs__selected, input.vs__search {
        padding: 0;
        margin: 0;
      }
    }

    .vs__search::placeholder {
      color: $input-placeholder-color;
    }

    .vs__actions {
      padding: 0;
    }
  }

  &.focus > div.vs__dropdown-toggle {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
}
</style>
