const { model, Schema } = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const CourseSectionSchema = new Schema({
  name: { type: String, required: true },
  assets: [{ type: Schema.Types.ObjectId }]
})

CourseSectionSchema.plugin(URLSlugs('name'))

module.exports = model('CourseSection', CourseSectionSchema)
