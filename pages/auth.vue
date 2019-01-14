<template>
  <div id="login" :style="loginStyle">
    <div class="container pt-5 d-flex justify-content-center">
      <login-form/>
    </div>
  </div>
</template>

<script>
import LoginForm from '~/components/LoginForm'
import img from '~/assets/img/bg/4.jpg'

export default {
  components: {
    LoginForm
  },
  data() {
    return {
      loginStyle: {
        height: '100vh',
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
