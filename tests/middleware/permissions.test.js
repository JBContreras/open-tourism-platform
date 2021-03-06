const tape = require('tape')
const permissions = require('../../src/middleware/permissions')
const { checkUserOwnsResource } = require('../../src/helpers/permissions')

const User = require('../../src/models/User')
const Event = require('../../src/models/Event')
const roles = require('../../src/constants/roles')

const { user } = require('../fixtures/users.json')
const { validEvent1 } = require('../fixtures/events.json')
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
    Event.create(validEvent1)
  ])
  .then(() => t.end())
  .catch(err => t.end(err))
})

// the tests
tape('checkUserOwnsResource with resource \'User\', and the correct user', t => {
  checkUserOwnsResource(User)(user.id)(user)
  .then((ownerStatus) => {
    t.ok(ownerStatus, 'ownerStatus is true')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('checkUserOwnsResource with resource \'User\', and an incorrect user', t => {
  checkUserOwnsResource(User)(user.id)(wrongUser)
  .then((ownerStatus) => {
    t.notOk(ownerStatus, 'ownerStatus is false')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('checkUserOwnsResource with resource \'Event\', and the correct user', t => {
  checkUserOwnsResource(Event)(validEvent1.id)(user)
  .then((ownerStatus) => {
    t.ok(ownerStatus, 'ownerStatus is true')
    t.end()
  })
  .catch(err => t.end(err))
})

tape('checkUserOwnsResource with resource \'Event\', and an incorrect user', t => {
  checkUserOwnsResource(Event)(validEvent1.id)(wrongUser)
  .then((ownerStatus) => {
    t.notOk(ownerStatus, 'ownerStatus is false')
    t.end()
  })
  .catch((err) => t.end(err))
})

tape('permissions initialization with bad implementation', t => {
  try {
    permissions({ authorizedRoles: [ roles.OWNER ] })
    t.end('should throw bad implementation')
  } catch (err) {
    t.end()
  }
})

tape('permissions initialization with another bad implementation', t => {
  try {
    permissions({ authorizedRoles: [ roles.SUPER, roles.ADMIN ] })
    t.end('should throw bad implementation')
  } catch (err) {
    t.end()
  }
})

tape('permissions initialization', t => {
  try {
    permissions({ authorizedRoles: [ roles.SUPER, roles.OWNER ] })
    t.end()
  } catch (err) {
    t.end(err)
  }
})

tape('another permissions initialization', t => {
  try {
    permissions({ authorizedRoles: [ roles.BASIC ] })
    t.end()
  } catch (err) {
    t.end(err)
  }
})
