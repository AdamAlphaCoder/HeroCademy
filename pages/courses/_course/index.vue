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
// TODO: Prevent adding of sections and assets while order is being updated
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
    updateSectionsOrder: _.debounce(async function(context) {
      try {
        const ids = this.course.sections.map(section => section._id)

        await this.$axios.put(
          `/api/courses/${this.course.slug}/updateSectionsOrder`,
          {
            sections: ids
          }
        )

        console.log(ids)

        window.onbeforeunload = null
      } catch (err) {
        console.error(err)
      }
    }, 1500),
    updateAssetsOrder: _.debounce(async function({
      from,
      to,
      oldIndex,
      newIndex
    }) {
      try {
        await this.$axios.put(
          `/api/courses/${this.course.slug}/updateAssetsOrder`,
          {
            // eslint-disable-next-line
            firstSection: this.course.sections[from],
            // eslint-disable-next-line
            secondSection: this.course.sections[to]
          }
        )

        window.onbeforeunload = null
      } catch (err) {
        console.error(err)
      }
    },
    1500),
    getComponentData() {
      // TODO: Implement update here
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
            window.onbeforeunload = function() {
              return 'Are you sure you want to navigate away?'
            }

            evt.from.id === 'accordionContainer' &&
            evt.to.id === 'accordionContainer'
              ? this.updateSectionsOrder(context)
              : this.updateAssetsOrder(context)
          }
        }
      }
    }
  }
}
</script>
