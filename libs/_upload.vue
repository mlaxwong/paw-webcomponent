<template>
  <div>
    <label ref="label" @click.prevent="handleClickLabel">Drag you file here</label>
    <input type="file" ref="input" @change.prevent="handleChangeInput" class="d-none" />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  mounted () {
    const metaCsrfParam = document.querySelector('meta[name=csrf-param]')
    const metaCsrfToken = document.querySelector('meta[name=csrf-token]')

    if (metaCsrfParam && metaCsrfToken) {
      this.csrfParam = metaCsrfParam.getAttribute('content')
      this.csrfToken = metaCsrfToken.getAttribute('content')
    }
  },
  data () {
    return {
      files: [],
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
        url: '/admin/project/upload',
        data: formData,
        onUploadProgress: (p) => {
          console.log(p)
        }
      }).then(data => {
        this.$refs.input.value = null
      })
    }
  }
}
</script>
