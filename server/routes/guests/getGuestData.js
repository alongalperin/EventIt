const express = require("express");

const { GuestEvents } = require("../../db/Models/GuestEvents");
const { Guest } = require("../../db/Models/Guest");

const router = express.Router();

// GET /guest/getGuestData/
const getGuestData = router.get("/guests/:eventId/:guestId", async function (req, res) {
  let { eventId, guestId } = req.params;

  try {
    let guest = await GuestEvents.findOne({
      where: { eventId: eventId, guestId: guestId },
      include: [Guest],
    });

    res.status(200).send({
      status: guest.status,
      firstname: guest.Guest.firstname,
      lastname: guest.Guest.lastname,
    });
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = { getGuestData };
