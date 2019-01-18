<template>
  <b-navbar toggleable="md" type="dark" variant="dark">
    <b-navbar-toggle id="toggle" target="nav_collapse"/>

    <nuxt-link to="/">
      <b-navbar-brand>HeroCademy</b-navbar-brand>
    </nuxt-link>

    <b-collapse id="nav_collapse" is-nav>
      <b-navbar-nav class="ml-4">
        <b-nav-item to="/auth" exact>Test</b-nav-item>
      </b-navbar-nav>

      <search/>

      <b-navbar-nav class="ml-4 ml-md-auto">
        <user-dropdown/>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import Search from '~/components/common/NavbarComponents/Search.vue'
import UserDropdown from '~/components/common/NavbarComponents/UserDropdown.vue'

export default {
  components: {
    Search,
    UserDropdown
  }
}
</script>

<style>
#nav_collapse {
  height: 52px;
}
</style>
