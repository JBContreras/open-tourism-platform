const { names: errNames, codes: errCodes, messages: errMessages } = require('./constants/errors')

const dbErrorHandlers = module.exports = {}

dbErrorHandlers.custom = (err, req, res, next) => {
  if (err.name !== errNames.CUSTOM) {
    return next(err)
  }
  switch (err.message) {
    case errMessages.GET_ID_NOT_FOUND:
      res.boom.notFound(err.message)
      break
    case errMessages.UPDATE_ID_NOT_FOUND:
      res.boom.badRequest(err.message)
      break
    case errMessages.DELETE_ID_NOT_FOUND:
      res.boom.badRequest(err.message)
      break

    // unhandled custom error
    default:
      res.boom.badImplementation(errMessages.UNHANDLED_CUSTOM)
  }
}

dbErrorHandlers.mongo = (err, req, res, next) => {
  // Mongo errors are of the form:
  // {
  //   name: 'MongoError',
  //   code: ...,
  //   MongoError: <full error stack>,
  //   message: ...,
  //   ...
  // }
  if (err.name !== errNames.MONGO) {
    return next(err)
  }
  switch (err.code) {
    case errCodes.MONGO_DUPLICATE_KEY:
      res.boom.badRequest(errMessages.DUPLICATE_KEY)
      break

    // unhandled mongo error
    default:
      res.boom.badImplementation(errMessages.UNHANDLED_MONGO)
  }
}

dbErrorHandlers.mongoose = (err, req, res, next) => {
  // Mongoose errors have specific names, and more info is stored under the key with the error name
  // e.g. err = {
  //   name: 'ValidationError',
  //   ValidationError: ...,
  //   ...
  // }
  switch (err.name) {
    case errNames.MONGOOSE_VALIDATION:
      const reasons = extractMongooseMessages(err)
      res.boom.badRequest(errMessages.VALIDATION_FAILED, { reasons })//, {errorMessages}) // trying to add more info as 'data' (See boom docs)
      break
    case errNames.MONGOOSE_CAST:
      res.boom.badRequest(errMessages.INVALID_ID)//, {errorMessages})
      break

    // unhandled mongoose error
    default:
      res.boom.badImplementation(errMessages.UNHANDLED_MONGOOSE)
  }
}

const extractMongooseMessages = (mongooseErr) => {
  const errorMessages = []
  Object.keys(mongooseErr.errors).forEach((singleError) => {
    errorMessages.push(mongooseErr.errors[singleError].message)
  })
  return errorMessages
}
