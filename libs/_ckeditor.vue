<template>
  <div>
    <textarea ref="editor" :name="this.$props.name" v-model="editorValue" :placeholder="placeholder"></textarea>
  </div>
</template>

<script>
export default {
  props: ['name', 'value', 'placeholder'],
  data () {
    return {
      editor: null,
      editorValue: null
    }
  },
  mounted () {
    this.editorValue = this.$props.value
    /* global ClassicEditor */
    ClassicEditor
      .create(this.$refs['editor'])
      .then(ckeditor => {
        this.editor = ckeditor
        this.editor.model.document.on('change:data', () => {
          this.editorValue = this.editor.getData()
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
