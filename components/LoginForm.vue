<template>
  <div id="loginForm" class="bg-white rounded shadow-7 w-400 mw-100 p-6">
    <h5 class="mb-7">{{ register ? 'Create an account' : 'Sign into your account' }}</h5>

    <form @submit.prevent="auth">
      <p v-if="form.error" class="error">{{ form.error }}</p>
      <div class="form-group">
        <input
          v-if="register"
          v-model="form.name"
          type="text"
          class="form-control"
          name="name"
          placeholder="Name"
        >
      </div>

      <div class="form-group">
        <input
          v-model="form.email"
          type="text"
          class="form-control"
          name="email"
          placeholder="Email"
        >
      </div>

      <div class="form-group">
        <input
          v-model="form.password"
          type="password"
          class="form-control"
          name="password"
          placeholder="Password"
        >
      </div>

      <div class="form-group">
        <input
          v-if="register"
          v-model="form.passwordAgain"
          type="password"
          class="form-control"
          name="password"
          placeholder="Confirm Password"
        >
      </div>

      <div class="form-group flexbox py-3">
        <a class="text-muted small-2" href="user-recover.html">Forgot password?</a>
      </div>

      <div class="form-group">
        <button
          class="btn btn-block btn-primary"
          type="submit"
        >{{ register ? 'Create account' : 'Sign in' }}</button>
      </div>
    </form>

    <div class="divider">Or Login With</div>
    <div class="text-center">
      <a class="btn btn-circle btn-sm btn-facebook mr-2" href="#" @click="facebookLogin">
        <i class="fa fa-facebook"/>
      </a>
    </div>

    <hr class="w-30">

    <p class="text-center text-muted small-2">
      {{ register ? "Already a member?" : "Don't have an account?" }}
      <a
        href="#"
        @click.prevent="register=!register"
      >{{ register ? 'Login here' : 'Register here' }}</a>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        error: null,
        name: '',
        email: '',
        password: '',
        passwordAgain: ''
      },
      register: false
    }
  },
  methods: {
    async auth() {
      try {
        if (this.register && this.form.password !== this.form.passwordAgain) {
          throw Error('Passwords should match')
        }

        if (this.register && !this.form.name) {
          throw Error('Enter your name')
        }
        const action = this.register ? 'register' : 'login'

        const payload = {
          email: this.form.email,
          password: this.form.password
        }

        if (this.register) payload.name = this.form.name

        await this.$store.dispatch(action, payload)
        this.$router.push('/')
      } catch (e) {
        this.form.error = e.message
      }
    },
    facebookLogin() {
      // FIXME: Change this before going to production
      window.location.href = `http://localhost:3000/api/auth/facebook`
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
