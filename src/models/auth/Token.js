const mongoose = require('mongoose')

const tokenSchema = mongoose.Schema(
  {
    accessToken: String,
    accessTokenExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
)

module.exports = mongoose.model('Token', tokenSchema)
