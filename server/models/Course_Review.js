const { model, Schema } = require('mongoose')

module.exports = model(
  'CourseReview',
  new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  })
)
