<template>
  <nuxt-link :to="`/courses/${course.slug}`">
    <p>{{ course.name }}</p>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  }
}
</script>
