<template>
  <div :class="{show: !this.isLoadingImage}">
    <progress v-if="item.isUploading" :value="item.progress" max="100"></progress>
    <a href="#" v-if="item.isUploading" @click.prevent="item.upload.cancel()">x</a>
    <span v-if="this.isLoading && !item.isUploading"><i class="fa fa-spinner fa-spin"></i> Loading ...</span>
    <img v-if="this.preview" :src="this.preview" />
    <div class="actions">
      <a v-if="isCompleted" href="#" @click="item.remove()" tabindex="-1"><i class="fa fa-trash"></i> Trash</a>
    </div>
    <input type="hidden" :value="item.value" :name="this.$props.name" />
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
  },
  methods: {
    syncItemData: function (val = null) {
      this.holdingItem = this.$props.item
    }
  },
  computed: {
    isLoading: function () {
      return this.isLoadingImage || !this.preview
    },
    isCompleted: function () {
      return !this.isLoadingImage && this.preview && !this.$props.item.isUploading
    }
  },
  watch: {
    'this.$props.item': function (val) {
      this.syncItemData()
    },
    'item.value': function (val) {
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
  }
}
</script>
