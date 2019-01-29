const { model, Schema } = require('mongoose')

const CourseSectionSchema = new Schema({
  name: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  position: Number
})

CourseSectionSchema.pre('save', function(next) {
  // Only increment when the document is new and position doesn't exist
  console.log('HAI')
  console.log(this.isNew)
  if (this.isNew && !this.position) {
    CourseSection.count({ course: this.course }).then(res => {
      this.position = res // Increment count
      next()
    })
  } else {
    next()
  }
})

const CourseSection = model('CourseSection', CourseSectionSchema)

module.exports = CourseSection
