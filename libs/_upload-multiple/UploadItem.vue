<template>
  <div :class="{show: this.isCompleted, error: item.error}">
    <div class="center">
      <progress v-if="item.isUploading" :value="item.progress" max="100"></progress>
      <span v-if="this.isLoading && !item.isUploading && !item.error"><i class="fa fa-spinner fa-spin"></i> Loading ...</span>
      <div v-if="item.error">
        <div><i class="fa fa-exclamation-triangle"></i></div>
        {{ item.file.name }}
      </div>
    </div>
    <a href="#" class="cancel" v-if="item.isUploading || item.error" @click.prevent="item.upload.cancel()"><i class="fa fa-times"></i></a>
    <img v-if="this.preview" :src="this.preview" />
    <div class="actions">
      <a v-if="isCompleted" href="#" @click="item.remove()" tabindex="-1"><i class="fa fa-trash"></i> Trash</a>
    </div>
    <input v-if="!item.error" type="hidden" :value="item.value" :name="this.inputName" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['url', 'name', 'item'],
  data () {
    return {
      preview: null,
      isLoadingImage: false,
      holdingItem: null
    }
  },
  mounted () {
    this.syncItemData()
    if (this.holdingItem.value) {
      this.loadPreview(this.holdingItem.value)
    }
  },
  methods: {
    syncItemData: function (val = null) {
      this.holdingItem = this.$props.item
    },
    loadPreview: function (val) {
      this.preview = null
      if (val) {
        axios.request({
          method: 'GET',
          url: this.$props.url + '?action=info&filename=' + val
        }).then(res => {
          const data = res.data
          if (data.success) {
            this.isLoadingImage = true
            this.preview = data.preview
            const img = new Image()
            img.onload = () => {
              setTimeout(() => {
                this.isLoadingImage = false
              }, 500)
            }
            img.src = data.preview
          }
        })
      }
    }
  },
  computed: {
    isLoading: function () {
      return this.isLoadingImage || !this.preview
    },
    isCompleted: function () {
      return !this.isLoadingImage && this.preview && !this.$props.item.isUploading
    },
    inputName: function () {
      return this.$props.name + '[]'
    }
  },
  watch: {
    'this.$props.item': function (val) {
      this.syncItemData()
    },
    'item.value': function (val) {
      this.loadPreview(val)
    }
  }
}
</script>
