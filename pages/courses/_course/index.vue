<template>
  <div class="container mt-4">
    <img :src="course.image" :alt="course.name" class="img-fluid">
    <h4 class="display-4">{{ course.name }}</h4>
    <p>{{ course.description }}</p>
    <small>{{ course.date | moment('DD MMM YYYY') }}</small>
    <b-button variant="success" size="lg" block @click="modalShow = !modalShow">Edit Course Info</b-button>
    <b-button class="mt-3" variant="primary" size="lg" block @click="editCourse">Edit Course Content</b-button>
    <b-button class="mt-3" variant="danger" size="lg" block @click="deleteCourse">Delete</b-button>
    <edit-course-details :course="course" :modal-show="modalShow" :hidden="onHidden"/>

    <course-details-accordion
      :sections="course.sections"
      :edit-mode="editMode"
      :handle-section-change="onSectionUpdate"
    />
  </div>
</template>

<script>
import EditCourseDetails from '~/components/course/EditCourseDetails'
import CourseDetailsAccordion from '~/components/course/CourseDetailsAccordion'

export default {
  components: {
    EditCourseDetails,
    CourseDetailsAccordion
  },
  middleware: 'checkAuth',
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
      modalShow: false,
      editMode: false
    }
  },
  methods: {
    onHidden(changesOccured) {
      this.modalShow = false
      if (changesOccured === true) {
        console.log('REFRESH PAGE')
        location.reload()
      }
    },
    editCourse() {
      this.$store.dispatch('updateMessage', {
        variant: 'warning',
        body: 'Edit content functionality not yet implemented!'
      })
    },
    deleteCourse() {
      this.$store.dispatch('updateMessage', {
        variant: 'warning',
        body: 'Delete functionality not yet implemented!'
      })
    },
    onNewSection() {},
    onNewAsset() {},
    onSectionUpdate(assets, index) {
      // eslint-disable-next-line
      this.$set(this.course.sections[index], 'assets', assets)
    },
    onSectionDelete() {},
    onAssetUpdate() {},
    onAssetDelete() {}
  }
}
</script>
