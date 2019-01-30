<template>
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
              v-for="asset in section.assets"
              :key="asset._id"
              :class="`${assetsDraggableOptions.disabled ? 'assetItems' : 'assetItems draggable'}`"
            >
              <a href="#">{{ asset.name }}</a>
              <p class="card-text">{{ asset.description }}</p>
            </div>
          </draggable>
        </b-card-body>
      </b-collapse>
    </b-card>
  </draggable>
</template>

<script>
// TODO: Add Update Course Sections and Assets functionality
// TODO: When an error occurs while updating course contents, throw error on page with this.$nuxt.error()

export default {
  props: {
    sections: {
      type: Array,
      required: true
    },
    sectionsDraggableOptions: {
      type: Object,
      required: true
    },
    assetsDraggableOptions: {
      type: Object,
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
      assetIsDragging: false
    }
  },
  methods: {
    updateAccordion(index) {
      // eslint-disable-next-line
      this.$set(this.sectionsExpanded, index, !this.sectionsExpanded[index])
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
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
</style>
