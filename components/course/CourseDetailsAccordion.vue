<template>
  <div id="courseDetailsAccordion">
    <draggable
      id="accordionContainer"
      :value="sections"
      :options="sectionsDraggableOptions"
      :move="onMove"
      :component-data="getComponentData()"
      element="div"
      class="accordion my-5"
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
        class="mb-2 draggableSections"
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
                :class="`${assetsDraggableOptions.disabled ? 'assetItems text-dark' : 'assetItems text-dark draggableAssets draggable'}`"
                :to="`/courses/${slug}/asset/${asset._id}`"
              >
                <!-- <a @click="editAssetDetails(sectionIndex, assetIndex)">{{ asset.name }}</a> -->
                <p class="card-text">{{ asset.name }}</p>
                <small>{{ (asset.type || '').charAt(0).toUpperCase() + (asset.type || '').slice(1).toLowerCase() }}</small>
                <a
                  v-if="editMode"
                  class="editLinks mr-3"
                  @click="editAssetIndexes = [sectionIndex, assetIndex]"
                >Edit</a>
              </div>
              <a @click="editAssetIndexes = [sectionIndex, -9999]">
                <div class="assetItems newElement">
                  <span class="mr-2">
                    <i class="fa fa-plus" aria-hidden="true"/>
                  </span> New Asset
                </div>
              </a>
            </draggable>
          </b-card-body>
        </b-collapse>
      </b-card>
      <div v-if="editMode" class="card newElement">
        <h5 class="card-title">
          <a @click="editSectionIndex = -9999">
            <span class="mr-2">
              <i class="fa fa-plus" aria-hidden="true"/>
            </span> New Section
          </a>
        </h5>
      </div>
    </draggable>
    <edit-course-section-details
      :hidden="onEditSectionHidden"
      :index="editSectionIndex"
      :handle-update="editSectionDetails"
    />
    <edit-course-section-asset-details
      :hidden="onEditAssetHidden"
      :indexes="editAssetIndexes"
      :handle-update="editAssetDetails"
    />
  </div>
</template>

<script>
import EditCourseSectionDetails from '~/components/course/EditCourseSectionDetails'
import EditCourseSectionAssetDetails from '~/components/course/EditCourseSectionAssetDetails'
// TODO: Add Update Course Sections and Assets functionality
// TODO: When an error occurs while updating course contents, throw error on page with this.$nuxt.error()

export default {
  components: {
    EditCourseSectionDetails,
    EditCourseSectionAssetDetails
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
      editAssetIndexes: [-1, -1]
    }
  },
  computed: {
    // Reduces redundant variables, will change when draggableOptions is updated
    sectionsDraggableOptions() {
      return Object.assign(
        { group: 'sections', draggable: '.draggableSections' },
        this.draggableOptions
      )
    },
    assetsDraggableOptions() {
      return Object.assign(
        { group: 'assets', draggable: '.draggableAssets' },
        this.draggableOptions
      )
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
      this.editAssetIndexes = [-1, -1]
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
        const createNewMode = index === -9999
        // If true, create new section instead of updating
        const response = createNewMode
          ? await this.$axios.post(`/api/courses/${this.slug}/sections`, {
              name
            })
          : await this.$axios.patch(
              `/api/courses/${this.slug}/sections/${this.sections[index]._id}`,
              { name }
            )

        const updatedSections = this.sections.slice(0)

        createNewMode
          ? updatedSections.push(response.data.courseSection)
          : (updatedSections[index].name = name)

        this.handleSectionsChange(updatedSections)
      } catch (err) {
        this.$nuxt.error({ statusCode: 500, message: err.message })
      }
    },
    async editAssetDetails(sectionIndex, assetIndex, values) {
      const keys = ['name', 'description', 'file', 'type']
      const update = {}
      keys.forEach(key => {
        if (values[key]) {
          update[key] = values[key]
        }
      })

      const createNewMode = assetIndex === -9999
      // If true, create new asset instead of updating
      const response = createNewMode
        ? await this.$axios.post(
            `/api/courses/${this.slug}/sections/${
              this.sections[sectionIndex]._id
            }/assets`,
            update
          )
        : await this.$axios.patch(
            `/api/courses/${this.slug}/sections/${
              this.sections[sectionIndex]._id
            }/assets/${this.sections[sectionIndex].assets[assetIndex]._id}`,
            update
          )

      const updatedSection = Object.assign({}, this.sections[sectionIndex])
      createNewMode
        ? updatedSection.assets.push(response.data.courseSectionAsset)
        : (() => {
            updatedSection.assets[assetIndex].name =
              response.data.courseSectionAsset.name
            updatedSection.assets[assetIndex].type =
              response.data.courseSectionAsset.type
          })()
      console.log('assets are')
      console.log(updatedSection.assets)
      this.handleAssetsChange(updatedSection.assets, sectionIndex)
    }
  }
}
</script>

<style>
.assetItems {
  position: relative;
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

.newElement {
  opacity: 0.6;
}

.newElement .card-title a::before {
  display: none;
}

.newElement .card-title a {
  padding-left: 0;
}
</style>
