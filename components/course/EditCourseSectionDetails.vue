<template>
  <b-modal
    :visible="modalShow"
    :title="`${index === -9999 ? 'Create New' : 'Update'} Course Section`"
    @hidden="hidden"
    @ok="handleOk"
    @clear="clearFields"
  >
    <p v-show="error" class="error">{{ error }}</p>
    <form @submit.stop.prevent="handleSubmit">
      <b-input id="name" v-model="name" class="mt-3" type="text" required placeholder="Enter name"/>
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
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
  data() {
    return {
      name: '',
      error: null
    }
  },
  computed: {
    modalShow() {
      // -9999 will create new section
      return this.index === -9999 ? true : this.index >= 0
    }
  },
  methods: {
    clearFields() {
      this.name = ''
      this.image = null
    },
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.name.length) {
        this.error = 'Name not provided'
      } else {
        this.handleSubmit(true)
      }
    },
    handleSubmit(changed) {
      if (changed !== true) return

      this.handleUpdate(this.index, { name: this.name })

      this.clearFields()
      this.hidden(changed)
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
