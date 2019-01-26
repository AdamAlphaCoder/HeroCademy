const { model, Schema } = require('mongoose')

const ASSET = require('./constants/ASSET')

const CourseSectionAssetSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String, required: true },
  type: {
    type: String,
    enum: ASSET.all,
    required: true
  },
  courseSection: { type: Schema.Types.ObjectId, ref: 'CourseSection' }
})

module.exports = model('CourseSectionAsset', CourseSectionAssetSchema)
