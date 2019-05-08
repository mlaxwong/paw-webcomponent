<template>
  <div class="paw-upload-multiple pb-2">
    <label ref="label" @click.prevent="handleClickLabel" tabindex="0" @keypress.enter="handleClickLabel">
      <span class="border-dotted"><i class="fa fa-plus"></i> Add an asset</span>
    </label>
    <div class="paw-upload-multiple-item-wrapper" v-if="this.items">
      <div 
        class="paw-upload-multiple-item" 
        v-for="(item, i) in this.items" 
        :key="item.id" 
        @dragstart="dragStartItem($event, i)" 
        @dragover="dragOverItem($event, i)"
        @dragend="dragEndItem"
        >
        <upload-item :url="$props.url"  :name="$props.name" :item="item"></upload-item>
      </div>
    </div>
    <input ref="input" type="file" class="d-none" multiple @change="handleOnChange"/>
  </div>
</template>

<script>
import axios from 'axios'
import UploadItem from './_upload-multiple/UploadItem'

const CancelToken = axios.CancelToken

export default {
  props: ['url', 'name', 'value'],
  data () {
    return {
      idCounter: 0,
      items: [],
      draging: null
    }
  },
  mounted () {
    const metaCsrfParam = document.querySelector('meta[name=csrf-param]')
    const metaCsrfToken = document.querySelector('meta[name=csrf-token]')

    if (metaCsrfParam && metaCsrfToken) {
      this.csrfParam = metaCsrfParam.getAttribute('content')
      this.csrfToken = metaCsrfToken.getAttribute('content')
    }
  },
  methods: {
    handleClickLabel: function (e) {
      this.$refs.input.click()
    },
    handleOnChange: function (e) {
      const files = e.target.files || e.dataTransfer.files
      Array.prototype.forEach.call(files, (file) => {
        this.addItem({file: file})
      })
      this.$refs.input.value = null
    },
    addItem (options) {
      const item = this.getItemTemplate({
        id: this.idCounter,
        axiosSource: CancelToken.source(),
        ...options
      })
      const newItem = {
        ...item,
        upload: this.createUploadFeature(item),
        remove: () => {
          this.removeItem(item.id)
        }
      }
      this.items.push(newItem)
      this.idCounter++
      newItem.upload.start()
    },
    removeItem (id) {
      const index = this.getItemIndex(id)
      this.items.splice(index, 1)
    },
    setItem (id, options) {
      const index = this.getItemIndex(id)
      for (const [key, value] of Object.entries(options)) {
        if (this.items[index]) {
          this.items[index][key] = value
        }
      }
    },
    dragStartItem (e, i) {
      this.draging = i
    },
    dragOverItem (e, i) {
      if (i !== this.draging) {
        this.moveItem(this.draging, i)
        this.draging = i
      }
    },
    dragEndItem () {
      this.draging = null
    },
    moveItem (from, to) {
      this.items.splice(to, 0, this.items.splice(from, 1)[0])
    },
    createUploadFeature (item) {
      return {
        start: () => {
          this.setItem(item.id, {isUploading: true})
          const formData = new FormData()
          formData.append('file', item.file)
          if (this.csrfParam && this.csrfToken) {
            formData.append(this.csrfParam, this.csrfToken)
          }
          axios.request({
            method: 'POST',
            url: this.$props.url,
            data: formData,
            onUploadProgress: (progressEvent) => {
              const uploadProgress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
              this.setItem(item.id, {progress: uploadProgress})
            },
            cancelToken: item.axiosSource.token
          }).then(res => {
            const data = res.data
            this.setItem(item.id, {
              isUploading: false,
              value: data.value
            })
          }).catch(error => {
            if (axios.isCancel(error)) {
            } else {
              throw error
            }
            this.setItem(item.id, {isUploading: false})
          })
        },
        cancel: () => {
          item.axiosSource.cancel()
          this.removeItem(item.id)
        }
      }
    },
    getItemTemplate (options) {
      return {
        id: null,
        axiosSource: null,
        file: null,
        value: null,
        progress: null,
        upload: null,
        isUploading: false,
        remove: null,
        ...options
      }
    },
    getItemIndex (id) {
      return this.items.findIndex(item => item.id === id)
    }
  },
  components: {
    UploadItem
  }
}
</script>


<style lang="scss">
.paw-upload-multiple
{
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

  .paw-upload-multiple-item-wrapper
  {
    width: 100%;
    padding-top: 15px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    .paw-upload-multiple-item 
    {
      height: 153px;
      margin-right: 10px;
      padding: 5px;
      border: 1px solid #ddd;
      display: inline-block;
      float: left;

      > div {
        transition: min-width 0.5s;
        -webkit-transition: min-width 0.5s;
        -moz-transition: min-width 0.5s;
        -ms-transition: min-width 0.5s;
        -o-transition: min-width 0.5s;

        img {
          height: 100px;
          opacity: 0;
          transition: opacity 0.5s;
          -webkit-transition: opacity 0.5s;
          -moz-transition: opacity 0.5s;
          -ms-transition: opacity 0.5s;
          -o-transition: opacity 0.5s;
        }

        &.show img {
          opacity: 1;
        }

        .actions {
          font-size: 0.7em;
          padding-top: 5px;
        }
      }

    }
  }
}
</style>
