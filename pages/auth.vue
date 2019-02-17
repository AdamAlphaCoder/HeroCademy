<template>
  <div class="layout-centered">
    <div id="login" :style="loginStyle" class="main-content">
      <login-form/>
    </div>
  </div>
</template>

<script>
import LoginForm from '~/components/LoginForm'
import img from '~/assets/img/bg/4.jpg'

export default {
  layout: 'nonavbarfooter',
  middleware: 'noAuth',
  components: {
    LoginForm
  },
  data() {
    return {
      loginStyle: {
        minHeight: '100vh',
        backgroundImage: `url(${img})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    }
  }
}
</script>

<style>
</style>
