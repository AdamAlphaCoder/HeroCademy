export const state = () => ({
  authUser: null
})

export const mutations = {
  SET_USER: function(state, user) {
    state.authUser = user
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.user) {
      commit('SET_USER', req.user)
    }
  },
  async login({ commit }, { email, password }) {
    if (!email || !password) throw new Error('Email and password are required')
    try {
      const {
        data: { user }
      } = await this.$axios.post('/api/auth/login', {
        email,
        password
      })
      commit('SET_USER', user)
    } catch (error) {
      throw new Error('Wrong email or password')
    }
  },
  async register({ commit }, { email, password, name }) {
    if (!email || !password) throw new Error('Email and password are required')
    try {
      const {
        data: { user }
      } = await this.$axios.post('/api/auth/register', {
        email,
        password,
        name
      })
      commit('SET_USER', user)
    } catch (error) {
      switch (error.response.status || 500) {
        case 409:
          throw new Error('This email is already taken')
        case 500:
          throw new Error('Internal server error')
      }
    }
  },
  async logout({ commit }) {
    const { data: success } = await this.$axios.post('/api/auth/logout')
    if (success) commit('SET_USER', null)
  },
  async changePassword({ commit }, { currentPassword, newPassword }) {
    if (!currentPassword || !newPassword)
      throw new Error('All fields are required')
    try {
      await this.$axios.patch('/api/auth', { currentPassword, newPassword })
      commit('SET_USER', null)
    } catch (error) {
      throw new Error('Wrong password')
    }
  }
}
