<template>
  <div class="d-inline-block">
    <b-button v-if="!$store.state.authUser" to="/auth" variant="success" exact>Login</b-button>
    <b-button-group v-if="$store.state.authUser" size="sm" class="mr-3">
      <b-dropdown variant="link" class="profileDropdown" right no-caret>
        <template slot="button-content">
          <img
            id="userDropdownImage"
            :src="$store.state.authUser.image ? $store.state.authUser.image : profile"
            alt="profile"
          >
        </template>
        <b-dropdown-item to="/me">
          <div>
            <p class="mb-0">{{ $store.state.authUser.name }}</p>
            <small class="text-muted">{{ $store.state.authUser.email }}</small>
          </div>
        </b-dropdown-item>
        <b-dropdown-divider/>
        <b-dropdown-item
          v-if="($store.state.authUser.role === 'LECTURER') || ($store.state.authUser.role === 'ADMIN')"
          to="/lecturer"
        >Lecturer Panel</b-dropdown-item>
        <b-dropdown-item to="/my-messages">Messages</b-dropdown-item>
        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
      </b-dropdown>
    </b-button-group>
  </div>
</template>

<script>
// TODO: Change check role type to using constants file
import profile from '~/assets/img/profile.jpg'

export default {
  data() {
    return {
      profile
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (err) {
        // TODO: Maybe show a centralized dialogue for showing messages later on inside default layout?
        console.error(err)
      }
    }
  }
}
</script>


<style>
.profileDropdown > button {
  color: #fff;
  padding-top: 0;
  padding-bottom: 0;
}

.dropdown-item.active,
.dropdown-item:active {
  color: #000;
  text-decoration: none;
  background-color: #fff;
}

#userDropdownImage {
  height: 50px !important;
  border-radius: 50%;
}

.btn-link {
  font-weight: 400;
  color: #fff;
}

.btn-link:hover {
  color: #a9a9a9 !important;
  text-decoration: none !important;
}
</style>
