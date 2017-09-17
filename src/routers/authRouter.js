const oauthController = require('../controllers/oauth')
const sessionController = require('../controllers/session')

const validateJWT = require('../middleware/validateJWT.js')
// const validateUser = require('../middleware/validateUser.js')
// const permissions = require('../middleware/permissions.js')

// const roles = require('../constants/roles.js')

const router = require('express').Router()

router.route('/login')
  .get(sessionController.getLoginPage)
  .post(sessionController.login)

router.route('/register')
  .get(sessionController.getRegisterPage)
  .post(sessionController.registerAndLogOn)

router.route('/oauth/authorize')
  .get(
    validateJWT(),
    oauthController.getAuthorizePage
  )
  .post(validateJWT({ credentialsRequired: true }), oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

module.exports = router
