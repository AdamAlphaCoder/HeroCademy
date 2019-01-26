<template>
  <div>
    <Navbar/>
    <div v-show="$store.state.message" id="alertContainer" class="container my-4">
      <b-alert
        :variant="($store.state.message || {}).variant"
        :show="!!$store.state.message"
        dismissible
        @dismissed="dismissAlert"
      >{{ ($store.state.message || {}).body }}</b-alert>
    </div>
    <nuxt/>
  </div>
</template>

<script>
import Navbar from '~/components/common/Navbar'

export default {
  components: {
    Navbar
  },
  methods: {
    dismissAlert() {
      this.$store.dispatch('updateMessage', null)
    }
  }
}
</script>

<style>
a {
  cursor: pointer;
}
</style>
