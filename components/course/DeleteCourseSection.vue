<template>
  <b-modal
    :visible="modalShow"
    title="Delete Course Section?"
    @hidden="hidden"
    @ok="handleOk"
  >Delete Course Section "{{ (sections[index] || {}).name }}"?</b-modal>
</template>

<script>
export default {
  props: {
    sections: {
      type: Array,
      required: true
    },
    hidden: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    handleUpdate: {
      type: Function,
      required: true
    }
  },
  computed: {
    modalShow() {
      return this.index >= 0
    }
  },
  methods: {
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if ((this.sections[this.index] || {})._id) this.handleUpdate(this.index)
      this.hidden()
    }
  }
}
</script>
