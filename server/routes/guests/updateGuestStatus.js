const express = require("express");

const { GuestEvents } = require("../../db/Models/GuestEvents");

const router = express.Router();

//POST /event/updateGuestStatus    update guest status to event
const updateGuestStatus = router.post("/guest/updateGuestStatus/", function (
  req,
  res
) {
  // todo: change  to put
  let guestId = req.body.guestId;
  let eventId = req.body.eventId;
  let newStatus = req.body.newStatus;

  GuestEvents.update(
    // Set status value
    { status: newStatus },
    // Where clause / criteria
    { where: { EventId: eventId, GuestId: guestId } }
  )
    .then(function () {
      res.status(200).send();
    })
    .catch(function (err) {
      res.status(500).send(err.message);
      //handle error here
    });
});

module.exports = { updateGuestStatus };
