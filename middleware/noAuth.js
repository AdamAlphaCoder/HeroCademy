// Prevents user from accessing said page when user has logged in

export default ({ store, redirect }) => {
  if (store.state.authUser) {
    redirect('/')
  }
}
