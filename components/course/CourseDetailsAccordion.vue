<template>
  <div id="accordionContainer" class="mt-3">
    <div class="accordion" role="tablist">
      <b-card v-for="(section, index) in sections" :key="section._id" no-body class="mb-2">
        <b-card-header header-tag="header" class="p-0" role="tab">
          <h5 class="card-title">
            <a
              :class="`${sectionsExpanded[index] ? '' : 'collapsed'}`"
              block
              @click="updateAccordion(index)"
            >{{ section.name }}</a>
          </h5>
        </b-card-header>
        <b-collapse
          :id="`section${index}`"
          v-model="sectionsExpanded[index]"
          :accordion="`accordion-${index}`"
          role="tabpanel"
        >
          <b-card-body>
            <draggable
              :value="section.assets"
              :options="options"
              :move="onMove"
              element="div"
              @start="isDragging=true"
              @end="isDragging=false"
              @input="handleSectionChange($event, index)"
            >
              <p v-for="asset in section.assets" :key="asset._id" class="card-text">{{ asset.name }}</p>
            </draggable>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
// TODO: Add Update Course Sections and Assets functionality
// TODO: When in update mode, expand all sections
export default {
  props: {
    sections: {
      type: Array,
      required: true
    },
    editMode: {
      type: Boolean,
      required: true
    },
    handleSectionChange: {
      type: Function,
      required: true
    }
    // onDragEnd: {
    //   type: Function,
    //   required: true
    // }
  },
  data() {
    return {
      sectionsExpanded: (this.sections || []).map(section => false),
      isDragging: false,
      options: {
        group: 'sections',
        animation: 100,
        onEnd: evt => {
          console.log({
            event: name,
            this: this,
            item: evt.item,
            from: evt.from,
            to: evt.to,
            oldIndex: evt.oldIndex,
            newIndex: evt.newIndex
          })
        }
      }
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
