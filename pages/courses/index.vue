<template>
  <div class="container mt-4">
    <h1>All courses available</h1>

    <course-list-simple :courses="courses"/>

    <b-pagination-nav
      v-if="(courses || []).length"
      v-model="currentPage"
      :number-of-pages="Math.ceil(count / perPage)"
      :link-gen="linkGen"
      :disabled="loading"
      size="md"
      align="center"
      @input="onPageChange"
    />
  </div>
</template>

<script>
import CourseListSimple from '~/components/courses/CourseListSimple'
import CourseListDetailed from '~/components/courses/CourseListDetailed'

export default {
  async asyncData(context) {
    try {
      const page = Number(context.query.page) || 1

      const response = await context.$axios.get('/api/courses', {
        params: {
          page: page - 1
        }
      })

      return {
        currentPage: page,
        courses: response.data.courses,
        count: response.data.count,
        perPage: response.data.perPage
      }
    } catch (error) {
      context.error(error)
    }
  },
  components: {
    CourseListSimple,
    CourseListDetailed
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    onPageChange(page) {
      if (this.loading === false) {
        this.loading = true
        this.$nuxt.$loading.start()

        this.$axios
          .get(`/api/courses`, {
            params: {
              page: page - 1
            }
          })
          .then(response => {
            if (!response.data.courses) {
              this.$nuxt.error({
                statusCode: 404
              })
              return
            }
            this.currentPage = page
            this.courses = response.data.courses
            this.$nuxt.$loading.finish()
            this.loading = false
            scroll(0, 0)
          })
          .catch(err => {
            this.$nuxt.error({ message: err.message })
          })
      }
    },
    linkGen(page) {
      return {
        path: `/courses?page=${page}`
      }
    }
  }
}
</script>
