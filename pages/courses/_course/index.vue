<template>
  <div class="container mt-4">
    <img :src="course.image" :alt="course.name" class="img-fluid">
    <h4 class="display-4">{{ course.name }}</h4>
    <p>{{ course.description }}</p>
    <small>{{ course.date | moment('DD MMM YYYY') }}</small>
    <b-button variant="success" size="lg" block @click="modalShow = !modalShow">Edit</b-button>
    <edit-course :course="course" :modal-show="modalShow" :hidden="onHidden"/>
    <b-button class="mt-3" variant="danger" size="lg" block>Delete</b-button>
  </div>
</template>

<script>
import EditCourse from '~/components/course/EditCourse'

export default {
  components: {
    EditCourse
  },
  async asyncData(context) {
    try {
      const {
        data: { course }
      } = await context.$axios.get(`/api/courses/${context.params.course}`)

      if (!course) {
        context.error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        course
      }
    } catch (err) {
      context.error(err)
    }
  },
  data() {
    return {
      modalShow: false
    }
  },
  methods: {
    onHidden(changesOccured) {
      this.modalShow = false
      if (changesOccured === true) {
        console.log('REFRESH PAGE')
        location.reload()
      }
    }
  }
}
</script>
