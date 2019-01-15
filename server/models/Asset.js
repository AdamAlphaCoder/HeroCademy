const { model, Schema } = require('mongoose')
const URLSlugs = require('mongoose-url-slugs')

const ASSET = require('./constants/ASSET')

const AssetSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String, required: true },
  type: {
    type: String,
    enum: ASSET.all,
    required: true
  }
})

AssetSchema.plugin(URLSlugs('name'))

module.exports = model('Asset', AssetSchema)
