const Event = require('../models/Event')
const { rejectIfEmpty } = require('../db/utils')
const { messages: errMessages } = require('../constants/errors')

const eventController = module.exports = {}

eventController.getAll = (req, res, next) => {
  // sends back array of events, filtered by queries
  Event.find(req.query)
    .populate('placeId')
    .sort('startTime')
    .then(events => res.status(200).send(events))
    .catch(next)
}

eventController.getById = (req, res, next) => {
  // receives id in url
  // sends back one event or errors
  const id = req.params.id
  Event.findById(id)
    .populate('placeId')
    .then(rejectIfEmpty(errMessages.GET_ID_NOT_FOUND))
    .then(event => res.status(200).send(event))
    .catch(next)
}

eventController.create = (req, res, next) => {
  // receives json for event in body
  // sends back created event
  const newEvent = new Event(req.body)
  newEvent.save()
    .then(event => res.status(201).send(event))
    .catch(next)
}

eventController.update = (req, res, next) => {
  // receives id in url
  // receives updated json for event in body
  // updates or errors
  const id = req.params.id
  Event.findByIdAndUpdate(id, req.body, { new: true })
    .then(rejectIfEmpty(errMessages.UPDATE_ID_NOT_FOUND))
    .then(updatedEvent => res.status(200).send(updatedEvent))
    .catch(next)
}

eventController.delete = (req, res, next) => {
  // receives id in url
  // deletes or errors
  const id = req.params.id

  Event.findByIdAndRemove(id)
    .then(rejectIfEmpty(errMessages.DELETE_ID_NOT_FOUND))
    .then(() => res.status(204).send())
    .catch(next)
}
