<template>
  <div class="container mt-4">
    <img :src="course.image" :alt="course.name" class="img-fluid">
    <h4 class="display-4">{{ course.name }}</h4>
    <p>{{ course.description }}</p>
    <small>{{ course.date | moment('DD MMM YYYY') }}</small>
    <b-button variant="success" size="lg" block @click="modalShow = !modalShow">Edit Course Info</b-button>
    <b-button class="mt-3" variant="primary" size="lg" block>Edit Course Content</b-button>
    <b-button class="mt-3" variant="danger" size="lg" block>Delete</b-button>
    <edit-course :course="course" :modal-show="modalShow" :hidden="onHidden"/>

    <div class="accordion mt-3" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <h5 class="card-title">
            <a v-b-toggle.accordion1 block>Accordion 1</a>
          </h5>
        </b-card-header>
        <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
          <b-card-body>
            <p class="card-text">
              I start opened because
              <code>visible</code> is
              <code>true</code>
            </p>
            <p class="card-text">{{ text }}</p>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import EditCourse from '~/components/course/EditCourse'

export default {
  components: {
    EditCourse
  },
  middleware: 'checkAuth',
  async asyncData(context) {
    try {
      const {
        data: { course }
      } = await context.$axios.get(`/api/courses/${context.params.course}`)

      if (!course) {
        context.error({ statusCode: 404, message: 'Page not found' })
      }

      return {
        course
      }
    } catch (err) {
      context.error(err)
    }
  },
  data() {
    return {
      modalShow: false,
      text: `
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
        richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
        brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
        tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
        assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore
        wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher
        vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic
        synth nesciunt you probably haven't heard of them accusamus labore VHS.
      `
    }
  },
  methods: {
    onHidden(changesOccured) {
      this.modalShow = false
      if (changesOccured === true) {
        console.log('REFRESH PAGE')
        location.reload()
      }
    }
  }
}
</script>
