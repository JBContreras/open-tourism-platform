const boom = require('boom')
const { messages: errMessages } = require('../constants/errors.json')

const { hasSufficientRole } = require('./permissions')

module.exports = fieldsMinRoles => (req, res, next) => {
  const permissionedFields = Object.keys(fieldsMinRoles)
  const unauthorizedFields = Object.keys(req.body)
    // filter out fields which are not permissioned or not in the schema
    .filter(field => permissionedFields.includes(field))
    // filter down to fields which user is not permitted to write to
    .filter(field =>
      !hasSufficientRole({ minSufficientRole: fieldsMinRoles[field] })(req.user))

  if (unauthorizedFields.length > 0) {
    const message = errMessages.FIELD_UNAUTHORIZED + unauthorizedFields.join(', ')
    return next(boom.unauthorized(message))
  }

  next()
}
