<template>
  <b-modal
    :visible="modalShow"
    :title="`${indexes[1] === -9999 ? 'Create New' : 'Update'} Asset`"
    @hidden="hidden"
    @ok="handleOk"
    @clear="clearFields"
  >
    <p v-show="error" class="error">{{ error }}</p>
    <form @submit.stop.prevent="handleSubmit">
      <b-input id="name" v-model="name" class="mt-3" type="text" required placeholder="Enter name"/>
      <b-form-textarea
        v-if="indexes[1] >= 0"
        id="description"
        v-model="description"
        :rows="3"
        :max-rows="6"
        class="mt-3"
        type="text"
        required
        placeholder="Enter description"
      />
      <b-form-file
        v-if="indexes[1] >= 0"
        v-model="file"
        class="mt-3"
        placeholder="Choose a file..."
        accept="image/*"
        required
      />
      <b-form-radio-group
        v-if="indexes[1] >= 0"
        v-model="type"
        :options="options"
        name="radioInline"
        class="mt-3"
      />
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
    indexes: {
      type: Array,
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
      description: '',
      file: null,
      type: 'VIDEO',
      options: [
        { text: 'Video', value: 'VIDEO' },
        { text: 'Downloadable', value: 'DOWNLOADABLE' }
      ],
      error: null
    }
  },
  computed: {
    modalShow() {
      // -9999 will create new section
      return this.indexes[1] === -9999 ? true : this.indexes[1] >= 0
    }
  },
  methods: {
    clearFields() {
      this.name = ''
      this.description = ''
      this.file = null
      this.type = 'VIDEO'
    },
    handleOk(evt) {
      console.log('OKKK')
      // Prevent modal from closing
      evt.preventDefault()

      if (!this.name.length && this.indexes[1] === -9999) {
        this.error = 'Name not provided'
        return
      }

      if (
        !this.name &&
        !this.description &&
        !this.file &&
        this.indexes[1] >= 0
      ) {
        this.error = 'Please provide the fields you want to update'
        return
      }

      this.handleSubmit(true)
    },
    handleSubmit(changed) {
      if (changed !== true) return

      this.handleUpdate(this.indexes[0], this.indexes[1], {
        name: this.name,
        description: this.description,
        file: this.file,
        type: this.type
      })

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
