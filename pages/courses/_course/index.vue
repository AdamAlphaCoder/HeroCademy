<template>
  <div class="container mt-4">
    <img :src="course.image" :alt="course.name" class="img-fluid">
    <h4 class="display-4">{{ course.name }}</h4>
    <p>{{ course.description }}</p>
    <small>{{ course.date | moment('DD MMM YYYY') }}</small>
    <b-button variant="success" size="lg" block @click="modalShow = !modalShow">Edit Course Info</b-button>
    <b-button
      :variant="sectionsDraggableOptions.disabled && assetsDraggableOptions.disabled ? 'primary' : 'warning'"
      class="mt-3"
      size="lg"
      block
      @click="editCourse"
    >{{ sectionsDraggableOptions.disabled ? 'Edit' : 'Stop Editing' }} Course Content</b-button>
    <b-button class="mt-3" variant="danger" size="lg" block @click="deleteCourse">Delete</b-button>
    <edit-course-details :course="course" :modal-show="modalShow" :hidden="onModalHidden"/>

    <course-details-accordion
      :sections="course.sections"
      :sections-draggable-options="sectionsDraggableOptions"
      :assets-draggable-options="assetsDraggableOptions"
      :handle-sections-change="onSectionsUpdate"
      :handle-assets-change="onAssetsUpdate"
      :get-component-data="getComponentData"
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
      editMode: false,
      draggableOptions: {
        disabled: true,
        animation: 100
      }
    }
  },
  computed: {
    // Reduces redundant variables, will change when draggableOptions is updated
    sectionsDraggableOptions: function() {
      return Object.assign({ group: 'sections' }, this.draggableOptions)
    },
    assetsDraggableOptions: function() {
      return Object.assign({ group: 'assets' }, this.draggableOptions)
    }
  },
  methods: {
    onModalHidden(changesOccured) {
      this.modalShow = false
      if (changesOccured === true) location.reload()
    },
    editCourse() {
      this.draggableOptions.disabled = !this.draggableOptions.disabled
    },
    deleteCourse() {
      this.$store.dispatch('updateMessage', {
        variant: 'warning',
        body: 'Delete functionality not yet implemented!'
      })
    },
    onNewSection() {},
    onNewAsset() {},
    onAssetDelete() {},
    onSectionDelete() {},
    onAssetsUpdate(assets, index) {
      // eslint-disable-next-line
      this.$set(this.course.sections[index], 'assets', assets)
    },
    onSectionsUpdate(sections) {
      this.course.sections = sections
    },
    getComponentData() {
      // TODO: Implement update here
      return {
        on: {
          end: evt => {
            console.log({
              event: 'onEnd',
              this: this,
              item: evt.item,
              from: evt.from.id,
              to: evt.to.id,
              oldIndex: evt.oldIndex,
              newIndex: evt.newIndex
            })
          }
        }
      }
    }
  }
}
</script>
