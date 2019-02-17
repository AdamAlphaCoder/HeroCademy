const { model, Schema } = require('mongoose')

const ASSET = require('./constants/ASSET')

const CourseSectionAssetSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  file: String,
  type: {
    type: String,
    enum: ASSET.all
  },
  courseSection: { type: Schema.Types.ObjectId, ref: 'CourseSection' },
  position: Number
})

CourseSectionAssetSchema.pre('save', function(next) {
  // Only increment when the document is new and position doesn't exist
  if (this.isNew && !this.position) {
    CourseSectionAsset.count({ courseSection: this.courseSection }).then(
      res => {
        this.position = res // Increment count
        next()
      }
    )
  } else {
    next()
  }
})

const CourseSectionAsset = model('CourseSectionAsset', CourseSectionAssetSchema)

module.exports = CourseSectionAsset
