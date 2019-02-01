<template>
  <div class="container mt-4">
    <img :src="course.image" :alt="course.name" class="img-fluid">
    <h4 class="display-4">{{ course.name }}</h4>
    <p>{{ course.description }}</p>
    <small>{{ course.date | moment('DD MMM YYYY') }}</small>
    <b-button variant="success" size="lg" block @click="modalShow = !modalShow">Edit Course Info</b-button>
    <b-button
      :variant="editMode ? 'warning' : 'primary'"
      class="mt-3"
      size="lg"
      block
      @click="editCourse"
    >{{ editMode ? 'Stop Editing' : 'Edit' }} Course Content</b-button>
    <b-button class="mt-3" variant="danger" size="lg" block @click="deleteCourse">Delete</b-button>
    <edit-course-details :course="course" :modal-show="modalShow" :hidden="onModalHidden"/>

    <course-details-accordion
      :slug="course.slug"
      :updating="updating"
      :edit-mode="editMode"
      :sections="course.sections"
      :handle-sections-change="onSectionsUpdate"
      :handle-assets-change="onAssetsUpdate"
      :get-component-data="getComponentData"
    />
  </div>
</template>

<script>
import _ from 'lodash'

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
      updating: false,
      editMode: false
    }
  },
  beforeMount() {
    window.addEventListener('beforeunload', this.unload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.unload)
  },
  methods: {
    onModalHidden(changesOccured) {
      this.modalShow = false
      if (changesOccured === true) location.reload()
    },
    editCourse() {
      this.editMode = !this.editMode
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
      this.$set(this.course.sections[index], 'assets', assets)
    },
    onSectionsUpdate(sections) {
      this.course.sections = sections
    },
    updateSectionsOrder: _.debounce(async function(context) {
      try {
        const ids = this.course.sections.map(section => section._id)

        await this.$axios.put(
          `/api/courses/${this.course.slug}/updateSectionsOrder`,
          {
            sections: ids
          }
        )

        this.updating = false
      } catch (err) {
        this.$nuxt.error({ message: err.message })
      }
    }, 1500),
    updateAssetsOrder: _.debounce(async function({ from, to }) {
      try {
        await this.$axios.put(
          `/api/courses/${this.course.slug}/updateAssetsOrder`,
          {
            firstSection: this.course.sections[from],

            secondSection: this.course.sections[to]
          }
        )

        this.updating = false
      } catch (err) {
        this.$nuxt.error({ message: err.message })
      }
    }, 1500),
    getComponentData() {
      return {
        on: {
          end: evt => {
            const context = {
              this: this,
              item: evt.item,
              from: Number(evt.from.id.split('-')[1]),
              to: Number(evt.to.id.split('-')[1]),
              oldIndex: evt.oldIndex,
              newIndex: evt.newIndex
            }

            // PREVENTS THE USER FROM NAVIGATING AWAY WHILE UPDATE IS IN PROGRESS
            this.updating = true

            evt.from.id === 'accordionContainer' &&
            evt.to.id === 'accordionContainer'
              ? this.updateSectionsOrder(context)
              : this.updateAssetsOrder(context)
          }
        }
      }
    },
    unload($event) {
      if (!this.updating) return true
      const confirmationMessage =
        'Do you really want to leave? you have unsaved changes!'

      $event.returnValue = confirmationMessage // Gecko, Trident, Chrome 34+
      return confirmationMessage // Gecko, WebKit, Chrome <34
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.updating) return next()

    const answer = window.confirm(
      'Do you really want to leave? you have unsaved changes!'
    )
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
</script>
