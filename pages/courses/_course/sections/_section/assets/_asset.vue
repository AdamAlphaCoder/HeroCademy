<template>
  <div class="container mt-4">
    <p>{{ courseSectionAsset.name }}</p>
  </div>
</template>

<script>
export default {
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
