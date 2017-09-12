const tape = require('tape')
const supertest = require('supertest')
const server = require('../../src/server')
const validateHeaderToken = require('../../src/middleware/validateHeaderToken')
const permissions = require('../../src/middleware/permissions.js')
const roles = require('../../src/constants/roles.js')

const checkUserOwnsResource = permissions.checkUserOwnsResource

const User = require('../../src/models/User')
const Event = require('../../src/models/Event')

const { user } = require('../fixtures/users.json')
const { event } = require('../fixtures/events.json')
const wrongUser = { id: 'wrong' }

// prepare the db
tape('emptying db.', t => {
  Promise.all([
    User.remove({}),
    Event.remove({})
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('filling db.', t => {
  Promise.all([
    User.create(user),
    Event.create(event)
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

// the tests
tape('checkUserOwnsResource with resource \'User\', and the correct user', t => {
  checkUserOwnsResource(User)(user.id)(user)
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('checkUserOwnsResource with resource \'User\', and an incorrect user', t => {
  checkUserOwnsResource(User)(user.id)(wrongUser)
  .then(() => t.end('promise should reject, as user is wrong'))
  .catch(err => t.end())
})

tape('checkUserOwnsResource with resource \'Event\', and the correct user', t => {
  checkUserOwnsResource(Event)(event.id)(user)
  .then(() => t.end())
  .catch(err => t.end(err))
})

tape('checkUserOwnsResource with resource \'Event\', and an incorrect user', t => {
  checkUserOwnsResource(Event)(event.id)(wrongUser)
  .then(() => t.end('promise should reject, as user is wrong'))
  .catch(err => t.end())
})

tape('permissions middleware implementation with bad options', t => {
  const badOptions = {
    minSufficientRole: roles.ADMIN,
    owningResourceIsSufficient: true
  }
  try {
    permissions(badOptions)()
    t.end('should throw a bad implementation error')
  } catch (err) {
    t.end()
  }
})
