<template>
  <div class="container mt-5">
    <b-button variant="primary" to="/lecturer/create-course" size="lg" block>Create Course</b-button>
    <b-button variant="primary" to="/lecturer/promo" size="lg" block>Promo Codes Section</b-button>
    <b-button variant="primary" to="/lecturer/revenue" size="lg" block>View Revenue</b-button>
  </div>
</template>

<script>
export default {
  middleware: ['checkAuth', 'checkLecturerStatus']
}
</script>
