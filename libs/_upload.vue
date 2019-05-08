<template>
  <div class="paw-upload">
    <div class="label-wrapper">
      <label  v-if="!isUploading" ref="label" @click.prevent="handleClickLabel" tabindex="0" @keypress.enter="handleClickLabel">
        <span v-if="!this.preview && !this.isRendering" class="border-dotted"><i class="fa fa-plus"></i> Add an asset</span>
        <img v-if="this.preview" :src="this.preview" :class="{show: !this.hidePreview}" />
      </label>
      <progress v-if="isUploading" :value="uploadPercentage" max="100"></progress>
      <button v-if="(isUploading) && !isRendering" class="btn btn-default btn-xs" type="button" @click="cancel">x</button>
      <span v-if="this.isRendering"><i class="fa fa-spinner fa-spin"></i> Loading ...</span>
    </div>
    <div class="actions">
      <a href="#" v-if="this.isUndoAble" @click.prevent="undo"><i class="fa fa-undo"></i> Undo</a> 
      <a href="#" v-if="this.preview && !isUploading" @click.prevent="clear"><i class="fa fa-trash"></i> Clear</a>
    </div>
    <input type="file" ref="input" @change.prevent="handleChangeInput" class="d-none" />
    <input type="hidden" :value="hiddenValue" :name="this.$props.name" />
  </div>
</template>

<script>
import axios from 'axios'
const CancelToken = axios.CancelToken

export default {
  props: ['name', 'url', 'value'],
  data () {
    return {
      hidePreview: true,
      preview: null,
      files: [],
      hiddenValue: null,
      oriHiddenValue: [],
      uploadPercentage: null,
      csrfParam: null,
      csrfToken: null,
      requestToken: null
    }
  },
  mounted () {
    const metaCsrfParam = document.querySelector('meta[name=csrf-param]')
    const metaCsrfToken = document.querySelector('meta[name=csrf-token]')

    if (metaCsrfParam && metaCsrfToken) {
      this.csrfParam = metaCsrfParam.getAttribute('content')
      this.csrfToken = metaCsrfToken.getAttribute('content')
    }

    this.hiddenValue = this.$props.value
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
      this.requestToken = CancelToken.source()

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
        },
        cancelToken: this.requestToken.token
      }).then(res => {
        const data = res.data
        if (data.success) {
          if (this.hiddenValue !== null) {
            this.oriHiddenValue.unshift(this.hiddenValue)
          }
          this.hiddenValue = data.value
        }
        this.$refs.input.value = null
        this.uploadPercentage = null
      }).catch(error => {
        if (axios.isCancel(error)) {
          this.requestToken = null
        } else {
          throw error
        }
      })
    },
    cancelUpload: function () {
      if (this.isUploading) {
        this.requestToken.cancel()
        // source = null
        this.uploadPercentage = null
        this.$refs.input.value = null
      }
    },
    cancel: function () {
      if (this.isUploading) {
        this.cancelUpload()
      } else {
        this.hiddenValue = null
        this.$refs.input.value = null
      }
    },
    undo: function () {
      this.hiddenValue = this.oriHiddenValue.shift()
    },
    clear: function () {
      this.oriHiddenValue.unshift(this.hiddenValue)
      this.hiddenValue = null
    }
  },
  computed: {
    isUploading: function () {
      return this.uploadPercentage
    },
    isRendering: function () {
      return this.hiddenValue && !this.preview
    },
    isUndoAble: function () {
      return (this.oriHiddenValue.length > 0) && !this.isUploading && !this.isRendering
    }
  },
  watch: {
    hiddenValue: function (val) {
      this.preview = null
      if (val) {
        axios.request({
          method: 'GET',
          url: this.$props.url + '?action=info&filename=' + val
        }).then(res => {
          const data = res.data
          if (data.success) {
            this.hidePreview = true
            this.preview = data.preview
            const img = new Image()
            img.onload = () => {
              setTimeout(() => {
                this.hidePreview = false
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

<style lang="scss">
.paw-upload
{
  div.label-wrapper
  {
    display: inline;

    label
    {
      cursor: pointer;

      span
      {
        font-size: 0.8em;
        padding: 10px;

        &.border-dotted
        {
          border: 1px dashed rgba(0, 0, 0, 0.2);
        }

        i
        {
          margin-right: 5px;
        }
      }

      img
      {
        height: 120px;
        opacity: 0;
        transition: opacity 0.5s;

        &.show {
          opacity: 1;
        }
      }
    }
  }

  div.actions
  {
    a
    {
      font-size: 0.8em;
    }
  }
}
</style>
