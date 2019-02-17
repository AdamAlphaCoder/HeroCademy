<template>
  <div class="container mt-4">
    <h3>Create a course here</h3>
    <b-form class="mt-3" @submit.prevent="submitCourse">
      <b-form-input id="name" v-model="name" type="text" required placeholder="Enter name"/>
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
      <b-button class="mt-3" variant="success" type="submit" block size="lg">Submit</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  middleware: ['checkAuth', 'checkLecturerStatus'],
  data() {
    return {
      name: '',
      description: '',
      image: null
    }
  },
  methods: {
    async submitCourse() {
      try {
        const formData = new FormData()

        formData.append('name', this.name)
        formData.append('description', this.description)
        formData.append('image', this.image)

        // TODO: Disable POSTing twice, and show loading indicator

        const {
          data: { success, course, message }
        } = await this.$axios.post('/api/courses', formData)

        if (!success) {
          this.$store.dispatch('updateMessage', {
            variant: 'danger',
            body: message
          })
          return
        }

        this.$router.push(`/courses/${course.slug}`)
      } catch (err) {
        this.$nuxt.error({ statusCode: 500, message: err.message })
      }
    }
  }
}
</script>
