<template>
  <div class="col-md-6 col-xl-3 mb-5">
    <nuxt-link :to="`/courses/${course.slug}`" class="card-links">
      <div class="card border hover-shadow-4">
        <img :src="course.image" :alt="course.name" class="card-img-top">
        <div class="card-body">
          <h5 class="card-title">{{ course.name }}</h5>
          <p>{{ course.lecturer.name }}</p>
        </div>
      </div>
    </nuxt-link>
  </div>
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

<style scoped>
.card-links {
  color: #000;
}
</style>
