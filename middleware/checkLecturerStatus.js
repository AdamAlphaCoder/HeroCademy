export default ({ store, error }) => {
  if (
    !(
      (store.state.authUser || {}).role === 'LECTURER' ||
      (store.state.authUser || {}).role === 'ADMIN'
    )
  ) {
    error({
      message: 'You are not authorized to perform this action',
      statusCode: 403
    })
  }
}
