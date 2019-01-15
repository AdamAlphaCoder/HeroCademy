const { model, Schema } = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const CourseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  lecturer: { type: Schema.Types.ObjectId, required: true },
  courseSections: [{ type: Schema.Types.ObjectId }]
})

CourseSchema.plugin(URLSlugs('name'))

module.exports = model('Course', CourseSchema)
