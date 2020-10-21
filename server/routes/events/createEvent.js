const express = require("express");
const { mailSenderService } = require("../../utils/mailUtil");
const randomId = require("random-id");

const { Event } = require("../../db/Models/Event");

const router = express.Router();

//POST /event  # create new event
const createEvent = router.post("/events", async (req, res) => {
  // manageId is event id number that is used to manage purposes only, the main use is with
  // the url that look like- manage/events/:manageId
  let manageId = randomId(12, "0");
  let eventId = randomId(10, "0");
  let { ownerEmail } = req.body;
<<<<<<< HEAD
		
  Event.create({
=======

  await Event.create({
>>>>>>> 302df4148fdfc33d913dd96d48f92040930fa4e6
    id: eventId, // the id is the same as the eventID
    manageId,
    eventId,
    ownerEmail,
    name: req.body.name,
    date: req.body.date,
    addressName: req.body.addressName,
    address: req.body.address,
    lng: req.body.lng,
    lat: req.body.lat,
  }).then(() => {
    mailSenderService(ownerEmail, manageId);
  });

  res.status(200).send(manageId);
});

module.exports = { createEvent };
