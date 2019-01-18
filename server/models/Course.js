const { model, Schema } = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const CourseSchema = new Schema({
  name: { type: String, required: true },
  image: {
    type: String,
    required: false
  },
  description: { type: String, required: true },
  date: { type: Date, default: new Date() },
  lecturer: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

CourseSchema.plugin(URLSlugs('name'))

module.exports = model('Course', CourseSchema)
