const { model, Schema } = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const CourseSectionSchema = new Schema({
  name: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' }
})

CourseSectionSchema.plugin(URLSlugs('name'))

module.exports = model('CourseSection', CourseSectionSchema)
