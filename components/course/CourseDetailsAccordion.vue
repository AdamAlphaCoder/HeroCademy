<template>
  <div id="courseDetailsAccordion">
    <draggable
      id="accordionContainer"
      :value="sections"
      :options="sectionsDraggableOptions"
      :move="onMove"
      :component-data="getComponentData()"
      element="div"
      class="accordion mt-3"
      role="tablist"
      @start="sectionIsDragging=true"
      @end="sectionIsDragging=false"
      @input="handleSectionsChange($event)"
    >
      <b-card
        v-for="(section, sectionIndex) in sections"
        :key="section._id"
        :id="`section-${sectionIndex}`"
        no-body
        class="mb-2"
      >
        <b-card-header header-tag="header" class="p-0" role="tab">
          <h5 class="card-title">
            <a
              :class="`${sectionsExpanded[sectionIndex] ? '' : 'collapsed'}${sectionsDraggableOptions.disabled ? '' : ' draggable'}`"
              block
              @click="updateAccordion(sectionIndex)"
            >{{ section.name }}</a>
          </h5>
          <a v-if="editMode" class="mr-3 editLinks" @click="editSectionIndex = sectionIndex">Edit</a>
        </b-card-header>
        <b-collapse
          :id="`collapse-${sectionIndex}`"
          v-model="sectionsExpanded[sectionIndex]"
          :accordion="`accordion-${sectionIndex}`"
          role="tabpanel"
        >
          <b-card-body>
            <draggable
              :value="section.assets"
              :options="assetsDraggableOptions"
              :move="onMove"
              :id="`assetsContainer-${sectionIndex}`"
              element="div"
              @start="assetIsDragging=true"
              @end="assetIsDragging=false"
              @input="handleAssetsChange($event, sectionIndex)"
            >
              <div
                v-for="(asset, assetIndex) in section.assets"
                :key="asset._id"
                :class="`${assetsDraggableOptions.disabled ? 'assetItems' : 'assetItems draggable'}`"
              >
                <a @click="editAssetDetails(sectionIndex, assetIndex)">{{ asset.name }}</a>
                <p class="card-text">{{ asset.description }}</p>
              </div>
            </draggable>
          </b-card-body>
        </b-collapse>
      </b-card>
    </draggable>
    <edit-course-section-details
      :hidden="onEditSectionHidden"
      :index="editSectionIndex"
      :handle-update="editSectionDetails"
    />
  </div>
</template>

<script>
import EditCourseSectionDetails from '~/components/course/EditCourseSectionDetails'
// TODO: Add Update Course Sections and Assets functionality
// TODO: When an error occurs while updating course contents, throw error on page with this.$nuxt.error()

export default {
  components: {
    EditCourseSectionDetails
  },
  props: {
    slug: {
      type: String,
      required: true
    },
    updating: {
      type: Boolean,
      required: true
    },
    editMode: {
      type: Boolean,
      required: true
    },
    sections: {
      type: Array,
      required: true
    },
    handleAssetsChange: {
      type: Function,
      required: true
    },
    handleSectionsChange: {
      type: Function,
      required: true
    },
    getComponentData: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      sectionsExpanded: (this.sections || []).map(section => false),
      sectionIsDragging: false,
      assetIsDragging: false,
      editSectionIndex: -1,
      editAssetIndex: -1
    }
  },
  computed: {
    // Reduces redundant variables, will change when draggableOptions is updated
    sectionsDraggableOptions() {
      return Object.assign({ group: 'sections' }, this.draggableOptions)
    },
    assetsDraggableOptions() {
      return Object.assign({ group: 'assets' }, this.draggableOptions)
    },
    draggableOptions() {
      return {
        disabled: !this.editMode && !this.updating,
        animation: 100
      }
    }
  },
  methods: {
    onEditSectionHidden() {
      this.editSectionIndex = -1
    },
    onEditAssetHidden() {
      this.editAssetIndex = -1
    },
    updateAccordion(index) {
      this.$set(this.sectionsExpanded, index, !this.sectionsExpanded[index])
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    async editSectionDetails(index, { name } = { name: null }) {
      try {
        await this.$axios.patch(
          `/api/courses/${this.slug}/sections/${this.sections[index]._id}`,
          { name }
        )

        const updatedSections = this.sections.slice(0)
        updatedSections[index].name = name
        this.handleSectionsChange(updatedSections)
      } catch (err) {
        this.$nuxt.error({ statusCode: 500, message: err.message })
      }
    },
    editAssetDetails(sectionIndex, assetIndex) {
      const updatedSection = Object.assign({}, this.sections[sectionIndex])

      updatedSection.assets[assetIndex].name = 'YOYOYO'
      this.handleAssetsChange(updatedSection.assets, sectionIndex)
    }
  }
}
</script>

<style>
.assetItems {
  padding: 1rem;
  background-color: #f9fafb;
  margin-top: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.draggable {
  cursor: move !important;
}

.editLinks {
  position: absolute;
  top: 15px;
  right: 5px;
  color: #50a1ff !important;
  transition: 0.2s linear;
}
</style>
