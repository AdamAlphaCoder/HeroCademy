export default ({ store, error }) => {
  if (!store.state.authUser) {
    error({
      message: 'You are not authenticated',
      statusCode: 401
    })
  }
}
