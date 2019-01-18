// Signifies a many-to-many relationship between a users
const { model, Schema } = require('mongoose')

module.exports = model(
  'UserFollowing',
  new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  })
)
