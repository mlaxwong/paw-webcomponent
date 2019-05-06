<template>
  <div class="paw-upload">
    <label ref="label" @click.prevent="handleClickLabel" tabindex="0" @keypress.enter="handleClickLabel">
      <span v-if="!this.preview">Drag you file here {{this.uploadPercentage}}</span>
      <img :src="this.preview" />
    </label>
    <input type="file" ref="input" @change.prevent="handleChangeInput" class="d-none" />
    <input type="hidden" :value="hiddenValue" :name="this.$props.name" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['name', 'url', 'value'],
  mounted () {
    const metaCsrfParam = document.querySelector('meta[name=csrf-param]')
    const metaCsrfToken = document.querySelector('meta[name=csrf-token]')

    if (metaCsrfParam && metaCsrfToken) {
      this.csrfParam = metaCsrfParam.getAttribute('content')
      this.csrfToken = metaCsrfToken.getAttribute('content')
    }

    this.hiddenValue = this.$props.value
  },
  data () {
    return {
      files: [],
      hiddenValue: null,
      uploadPercentage: null,
      csrfParam: null,
      csrfToken: null
    }
  },
  methods: {
    handleClickLabel: function () {
      this.$refs.input.click()
    },
    handleChangeInput: function (e) {
      const files = e.target.files || e.dataTransfer.files
      this.handleUpload(files[0])
    },
    handleUpload: function (file) {
      const formData = new FormData()
      formData.append('file', file)
      if (this.csrfParam && this.csrfToken) {
        formData.append(this.csrfParam, this.csrfToken)
      }
      axios.request({
        method: 'POST',
        url: this.$props.url,
        data: formData,
        onUploadProgress: (progressEvent) => {
          this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        }
      }).then(res => {
        const data = res.data
        if (data.success) {
          this.hiddenValue = data.value
        }
        this.$refs.input.value = null
      })
    }
  },
  computed: {
    preview: function () {
      return this.hiddenValue
    }
  }
}
</script>

<style lang="scss">
.paw-upload img
{
  max-width: 100%;
}
</style>
