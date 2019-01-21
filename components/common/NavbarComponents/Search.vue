<template>
  <b-navbar-nav class="ml-4 ml-md-auto py-2">
    <b-nav-form id="searchBox" class="mr-sm-2" @submit.prevent="searchSubmit">
      <b-input-group>
        <b-form-input v-model="searchTerm" placeholder="Search here..." size="md" type="text"/>
        <b-input-group-append>
          <b-btn variant="warning">Search</b-btn>
        </b-input-group-append>
      </b-input-group>
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
