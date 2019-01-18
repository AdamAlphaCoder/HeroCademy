const { model, Schema } = require('mongoose')

module.exports = model(
  'CourseReview',
  new Schema({
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: new Date() }
  })
)
