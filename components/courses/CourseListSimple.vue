<template>
  <div class="courseListCards">
    <course-card-simple v-for="course in courses" :key="course._id" :course="course"/>
  </div>
</template>

<script>
import CourseCardSimple from '~/components/courses/CourseCardSimple'

export default {
  components: {
    CourseCardSimple
  },
  props: {
    courses: {
      type: Array,
      required: true
    }
  }
}
</script>
