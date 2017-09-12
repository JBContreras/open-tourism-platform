const oauthController = require('../controllers/oauth')
const sessionController = require('../controllers/session')

const validateJWT = require('../middleware/validateJWT.js')

const router = require('express').Router()

router.route('/login')
  .get(sessionController.getLoginPage)
  .post(sessionController.login)

router.route('/register')
  .get(sessionController.getRegisterPage)
  .post(sessionController.registerAndLogOn)

router.route('/oauth/authorize')
  .get(
    validateJWT({ credentialsRequired: false }),
    oauthController.getAuthorizePage
  )
  .post(validateJWT(), oauthController.getAuthorizationCode)

router.route('/oauth/token')
  .post(oauthController.getToken)

module.exports = router
