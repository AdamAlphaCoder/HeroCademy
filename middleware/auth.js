export default ({ store, redirect }) => {
  if (!store.state.authUser) {
    // error({
    //   message: 'You are not authenticated',
    //   statusCode: 401
    // })
    redirect('/auth')
  }
}
