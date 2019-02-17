<template>
  <b-modal
    :visible="modalShow"
    title="Update Course"
    @hidden="hidden"
    @ok="handleOk"
    @clear="clearFields"
  >
    <p v-show="error" class="error">{{ error }}</p>
    <form @submit.stop.prevent="handleSubmit">
      <b-form-textarea
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
        v-model="image"
        class="mt-3"
        placeholder="Choose a image..."
        accept="image/*"
        required
      />
    </form>
  </b-modal>
</template>

<script>
export default {
  props: {
    modalShow: {
      type: Boolean,
      required: true
    },
    hidden: {
      type: Function,
      required: true
    },
    course: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      description: '',
      image: null,
      error: null
    }
  },
  methods: {
    clearFields() {
      this.description = ''
      this.image = null
    },
    handleOk(evt) {
      // Prevent modal from closing
      evt.preventDefault()
      if (!this.description.length && !this.image) {
        this.error = 'Description or image not provided'
      } else {
        this.handleSubmit(true)
      }
    },
    async handleSubmit(changed) {
      console.log('HANDLE SUBMIT')
      if (changed !== true) return

      try {
        // TODO: Add a loading indicator when submitting this shit
        const formData = new FormData()

        if (this.description.length) {
          formData.append('description', this.description)
        }

        if (this.image) {
          formData.append('image', this.image)
        }

        const {
          data: { success, message }
        } = await this.$axios.patch(
          `/api/courses/${this.course.slug}`,
          formData
        )

        if (!success) throw Error(message)

        this.clearFields()
        this.hidden(changed)
      } catch (err) {
        this.$nuxt.error({ statusCode: 500, message: err.message })
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
