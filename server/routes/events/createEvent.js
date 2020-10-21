const express = require("express");
const { mailSenderService } = require("../../utils/mailUtil");
const randomId = require("random-id");

const { Event } = require("../../db/Models/Event");

const router = express.Router();

//POST /event  # create new event
const createEvent = router.post("/event", (req, res) => {
  // manageId is event id number that is used to manage purposes only, the main use is with
  // the url that look like- manage/event/:manageId
  let manageId = randomId(18, "0");
  let eventId = randomId(10, "0");
  let { ownerEmail } = req.body;
		
  Event.create({
    id: eventId, // the id is the same as the eventID
    manageId,
    eventId,
    ownerEmail: req.body.ownerEmail,
    name: req.body.name,
    date: req.body.date,
    address: req.body.address,
    lng: req.body.lng,
    lat: req.body.lat,
  }).then(() => {
    mailSenderService(ownerEmail, manageId);
  });

  res.status(200).send(manageId);
});

module.exports = { createEvent };
