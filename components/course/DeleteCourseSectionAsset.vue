<template>
  <b-modal
    :visible="modalShow"
    title="Delete Asset?"
    @hidden="hidden"
    @ok="handleOk"
  >Delete Asset "{{ (((sections[indexes[0]] || {}).assets || [])[indexes[1]] || {}).name }}"?</b-modal>
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
    indexes: {
      type: Array,
      required: true
    },
    handleUpdate: {
      type: Function,
      required: true
    }
  },
  computed: {
    modalShow() {
      return this.indexes[0] >= 0 && this.indexes[1] >= 0
    }
  },
  methods: {
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (
        (
          ((this.sections[this.indexes[0]] || {}).assets || [])[
            this.indexes[1]
          ] || {}
        )._id
      ) {
        this.handleUpdate(this.indexes[0], this.indexes[1])
      }
      this.hidden()
    }
  }
}
</script>
