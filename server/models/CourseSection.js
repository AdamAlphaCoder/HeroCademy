const { model, Schema } = require('mongoose')

const CourseSectionSchema = new Schema({
  name: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' }
})

module.exports = model('CourseSection', CourseSectionSchema)
