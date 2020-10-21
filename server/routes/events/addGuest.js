const express = require("express");
const { mailSenderService } = require("../../utils/mailUtil");
const randomId = require("random-id");

const { Guest } = require("../../db/Models/Guest");
const { GuestEvents } = require("../../db/Models/GuestEvents");

const router = express.Router();

//POST /event/addGuest  # add guest to event
const addGuest = router.post("/events/guests", async (req, res) => {
  let guestId = randomId(10, "0");
  const manageId = req.body.manageId;
  const guestEmail = req.body.email;
  const eventId = req.body.eventId;

  try {
    let newGuest = await Guest.create({
      id: guestId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    });

    let userInEvent = await GuestEvents.create({
      GuestId: guestId,
      EventId: eventId,
      manageId: manageId,
      status: "unknown",
    });

    mailSenderService(guestEmail, eventId, guestId);
    res.status(200).send(newGuest);
  } catch (e) {
    console.log(e.message);
    res.status(500).send();
  }
});

module.exports = { addGuest };
