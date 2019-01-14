<template>
  <div id="loginForm">
    <h5 id="headline" class="mb-5">{{ register ? 'Create an account' : 'Sign into your account' }}</h5>
    <form @submit.prevent="auth">
      <p v-if="form.error" class="error">{{ form.error }}</p>
      <input
        v-if="register"
        v-model="form.name"
        class="form-control mb-3"
        type="text"
        name="name"
        placeholder="Name"
      >
      <input
        v-model="form.email"
        class="form-control mb-3"
        type="text"
        name="email"
        placeholder="Email"
      >
      <input
        v-model="form.password"
        class="form-control mb-3"
        type="password"
        name="password"
        placeholder="Password"
      >
      <input
        v-if="register"
        v-model="form.passwordAgain"
        class="form-control mb-3"
        type="password"
        name="passwordAgain"
        placeholder="Confirm Password"
      >
      <button
        class="btn btn-primary btn-block"
        type="submit"
      >{{ register ? 'Create account' : 'Sign in' }}</button>
    </form>
    <button class="btn btn-success btn-block mt-3" @click="facebookLogin">Login with Facebook</button>
    <small class="d-block text-center mt-3">
      {{ register ? "Already a member?" : "Don't have an account?" }}
      <a
        href="#"
        class="text-decoration-none"
        @click.prevent="register=!register"
      >{{ register ? 'Login here' : 'Register here' }}</a>
    </small>
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
      register: false,
      loginFormStyle: {
        width: '400px'
      }
    }
  },
  methods: {
    async auth() {
      try {
        if (this.register && this.form.password !== this.form.passwordAgain) {
          throw Error('Passwords should match')
        }
        const action = this.register ? 'register' : 'login'
        await this.$store.dispatch(action, {
          email: this.form.email,
          password: this.form.password
        })
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
a {
  text-decoration: underline;
}

#headline {
  font-family: Dosis, sans-serif;
}

#loginForm {
  position: relative;
  background-color: white;
  width: 100%;
  padding: 2rem !important;
  max-width: 400px;
  box-shadow: 0 0 48px rgba(0, 0, 0, 0.06);
  -webkit-box-shadow: 0 0 48px rgba(0, 0, 0, 0.06);
  border-radius: 0.25rem !important;
}
.m {
  border: 1px solid #888;
  background: #ddd;
  padding: 0.4em 0.8em;
}
.m form {
  margin: 1em auto 0.2em;
}
.error {
  color: red;
}
</style>
