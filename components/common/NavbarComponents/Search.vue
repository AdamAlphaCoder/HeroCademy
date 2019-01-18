<template>
  <b-navbar-nav class="ml-4 ml-md-auto">
    <b-nav-form @submit.prevent="searchSubmit">
      <b-form-input
        id="searchBox"
        v-model="searchTerm"
        placeholder="Search here..."
        size="md"
        class="mr-sm-2"
        type="text"
      />
    </b-nav-form>
  </b-navbar-nav>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: ''
    }
  },
  methods: {
    searchSubmit() {
      console.log(this.searchTerm)
    }
  }
}
</script>

<style>
#searchBox {
  width: 400px;
  max-width: 100%;
}
</style>
