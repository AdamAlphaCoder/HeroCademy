<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-8 p-md-3">
        <video-player
          v-if="courseSectionAsset.file && courseSectionAsset.type === 'VIDEO'"
          :source="courseSectionAsset.file"
        />
        <b-button
          v-if="courseSectionAsset.file && courseSectionAsset.type === 'DOWNLOADABLE'"
          :href="courseSectionAsset.file"
          target="_blank"
          variant="success"
          block
          size="lg"
        >Download</b-button>
        <h3 class="mt-3">{{ courseSectionAsset.name }}</h3>
        <p>Type: {{ (courseSectionAsset.type || '').charAt(0).toUpperCase() + (courseSectionAsset.type || '').slice(1).toLowerCase() }}</p>
      </div>
      <div class="col-md-4 p-md-3">
        <div id="suggestionsContainer">
          <b-list-group>
            <b-list-group-item
              disabled
            >Section {{ courseSection.position + 1 }}: {{ courseSection.name }}</b-list-group-item>
            <b-list-group-item
              v-for="asset in assetsInSection"
              :key="asset._id"
              :to="`/courses/${courseSlug}/sections/${sectionId}/assets/${asset._id}`"
            >{{ asset.name }}</b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: Add a sidebar for navigating through assets in course
import VideoPlayer from '~/components/course/VideoPlayer'

export default {
  components: {
    VideoPlayer
  },
  middleware: 'checkAuth',
  async asyncData(context) {
    try {
      const {
        data: { courseSection, courseSectionAsset, assetsInSection }
      } = await context.$axios.get(
        `/api/courses/${context.params.course}/sections/${
          context.params.section
        }/assets/${context.params.asset}`
      )

      if (!courseSectionAsset) {
        return context.error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        courseSlug: context.params.course,
        courseSectionAsset,
        courseSection,
        assetsInSection,
        sectionId: context.params.section
      }
    } catch (err) {
      context.error(err)
    }
  }
}
</script>

<style>
#suggestionsContainer > .list-group {
  max-height: 350px;
  overflow-y: scroll;
}
</style>
