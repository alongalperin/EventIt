const express = require("express");

const { Event } = require("../../db/Models/Event");

const router = express.Router();

// GET ///event/:eventId    returns event instance
const getEvent = router.get("/events/:eventId", function (req, res) {
  let eventId = req.params.eventId;
  let query = {};

  if (checkValidId(eventId, 10)) {
    // we have event guest
    query = {
      eventId: eventId,
    };
  } else if (checkValidId(eventId, 12)) {
    // we have event manager
    query = {
      manageId: eventId,
    };
  } else {
    // invalid id
    res.status(404).send();
  }

  Event.findOne({ where: query }).then((event) => {
    if (event) {
      res.status(200).send(event);
    } else {
      res.status(404).send();
    }
  });
});

function checkValidId(id, requiredLength) {
  return id != undefined && id.length == requiredLength && /^\d+$/.test(id);
}

module.exports = { getEvent };
