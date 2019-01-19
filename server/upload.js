const crypto = require('crypto')
const path = require('path')

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET
})

// TODO: Multer get file type, and append it to key before uplaod
module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname })
    },
    key: (req, file, cb) => {
      // eslint-disable-next-line
      crypto.pseudoRandomBytes(16, (err, raw) => {
        cb(
          null,
          raw.toString('hex') + Date.now() + path.extname(file.originalname)
        )
      })
    }
  })
})
