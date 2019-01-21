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
html {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
