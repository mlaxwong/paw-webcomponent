<template>
  <div ref="wrapper" class="fd__wrapper">
    <input type="hidden" :name="name" :value="value">
    <input ref="textBox" type="text" class="fd__display-textbox" :disabled="disabled"
      :value="displayText" :placeholder="placeholder" readonly="readonly" @click="textBoxClicked" @focus.prevent="textBoxFocus" @blur.prevent="textBoxBlur">
    <div class="fd__list" v-show="isShowList">
      <div class="fd__filter-input">
        <input ref="filterTextBox" type="text" class="fd__filter-textbox" placeholder="Filter..." v-model="filterString" @focus.prevent="filterTextBoxFocus" @blur.prevent="filterTextBoxBlur">
      </div>
      <ul>
        <li class="fd__item" v-if="showEmptyItem" :value="emptyItemValue"
          @click.stop.prevent="itemClicked(null)">{{ emptyItemText || '&nbsp;' }}</li>
        <li v-for="(item, index) in filteredItems" :key="index" @click="() => console.log('testing')">
          {{item}}
        </li>
        <li v-if="filteredItems.length === 0">No Items</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      textBoxFocused: false,
      filterTextBoxFocused: false,
      filterString: null,
      showList: false,
      _items: []
    }
  },
  props: {
    name: { type: String, default: '' },
    value: { type: [String, Number, Boolean, Date], default: null },
    placeholder: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    showEmptyItem: { type: Boolean, default: false },
    emptyItemText: { type: String, default: null },
    emptyItemValue: { type: String, default: null },
    items: { type: String, default: null },
    idKey: { type: String, default: null },
    valueKey: { type: String, default: 'value' },
    textKey: { type: String, default: 'label' },
    filterTargetKey: { type: String, default: null },
    ignoreCase: { type: Boolean, default: true }
  },
  computed: {
    isShowList () {
      return this.textBoxFocused || this.filterTextBoxFocused || true
    },
    filteredItems () {
      const items = this._items || []
      if (!this.filterString) return items
      if (!items || items.length === 0) return []
      const flags = this.ignoreCase ? 'i' : ''
      const regexp = new RegExp(this.filterString, flags)
      return items.filter(x => {
        const targetValue = this.filterTargetKey
          ? x[this.filterTargetKey]
          : JSON.stringify(x)
        return regexp.test(targetValue)
      })
    },
    selectedItem () {
      const items = this._items || []
      return items.find(
        x => this.value === (this.valueKey ? x[this.valueKey] : x)
      )
    },
    displayText () {
      const item = this.selectedItem
      if (!item) return ''
      return this.textKey ? item[this.textKey] : item
    }
  },
  methods: {
    textBoxFocus () {
      this.textBoxFocused = true
    },
    textBoxBlur () {
      this.textBoxFocused = false
    },
    filterTextBoxFocus () {
      this.filterTextBoxFocused = true
    },
    filterTextBoxBlur () {
      this.filterTextBoxFocused = false
    },
    textBoxClicked () {
      if (this.disabled) return
      this.showList = !this.showList
    },
    itemClicked (item) {
      if (item) {
        const value = this.valueKey ? item[this.valueKey] : item
        this.$emit('input', value)
      } else {
        this.$emit('input', this.emptyItemValue || null)
      }
      this.reset()
    },
    reset () {
      this.showList = false
      this.filterString = ''
    }
  },
  watch: {
    showList (val) {
      this.$nextTick(() => {
        if (val) {
          this.$refs.filterTextBox.focus()
        }
      })
    }
  },
  mounted () {
    const $this = this
    document.addEventListener('click', function (e) {
      const target = (e.target || e.srcElement).closest('.fd__wrapper')
      if (target === $this.$refs.wrapper) return
      $this.reset()
    })

    let items = this.$props.items
    this._items = typeof items === 'string' ? JSON.parse(items) : items
  }
}
</script>

<style lang="scss" scoped>
.fd__wrapper {
  position: relative;
  width: 100%;
  * {
    font-size: 1rem;
  }
  input.fd__display-textbox,
  input.fd__filter-textbox {
    width: 100%;
  }
  .fd__list {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 4px;
    border: solid 1px rgb(192, 192, 192);
    background: white;
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.2);
    margin-top: -1px;
    ul {
      margin: 4px 0 0 0;
      padding: 4px;
      overflow-x: auto;
      overflow-y: scroll;
      max-height: 40vh;
      li {
        padding: 4px 1px;
        cursor: pointer;
        list-style: none;
        line-height: 1;
        &.fd__item:hover {
          background: aliceblue;
        }
      }
    }
  }
}
</style>
