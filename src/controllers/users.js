const User = require('../models/User')

const userControllers = module.exports = {}

userControllers.getAll = (req, res) => {
  // sends back array of users, filtered by queries
  // status codes: 200 (success)
  User.find()
    .then(users => {
      res.send(users)
    })
    .catch((err) => {
      const errorObj = { message: `Database Error: ${err.message}` }
      res.status(500).send(errorObj)
    })
}

userControllers.getById = (req, res) => {
  // receives id in url
  // sends back one user
  // status codes: 200 (success), 404 (not found)
  res.send('todo')
}

userControllers.create = (req, res) => {
  // receives json for user in body
  // adds to db
  // status codes: 201 (created), 400 (bad request)
}

userControllers.update = (req, res) => {
  // receives id in url
  // receives updated json for user in body
  // amends db record
  // status codes: 200 (success), 400 (bad request)
  const id = req.params.id
  const errorObj = { message: 'Database error' }
  res.status(400).send(errorObj)
}

userControllers.delete = (req, res) => {
  // receives id in url
  // deletes
  // status codes: 200 (success), 400 (bad request)
}
