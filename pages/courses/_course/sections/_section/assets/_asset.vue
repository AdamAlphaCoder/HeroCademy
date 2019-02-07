<template>
  <div class="container mt-4">
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
        data: { courseSectionAsset }
      } = await context.$axios.get(
        `/api/courses/${context.params.course}/sections/${
          context.params.section
        }/assets/${context.params.asset}`
      )

      if (!courseSectionAsset) {
        context.error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        courseSectionAsset
      }
    } catch (err) {
      context.error(err)
    }
  }
}
</script>
