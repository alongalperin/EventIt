const express = require("express");

const { GuestEvents } = require("../../db/Models/GuestEvents");
const { Guest } = require("../../db/Models/Guest");

const router = express.Router();

// GET /event/getGuests/    return lists of guests with all 4 posible statuses
const getGuests = router.get("/events/guests/:manageId", function (req, res) {
  let manageId = req.params.manageId;

  GuestEvents.findAll({
    where: {
      manageId,
    },
    include: [
      {
        model: Guest,
      },
    ],
  })
    .then((guests) => {
      const going = guests.filter((guest) => guest.status == "going").map((guest) => guest.Guest);
      const notSure = guests.filter((guest) => guest.status == "notSure").map((guest) => guest.Guest);
      const notGoing = guests.filter((guest) => guest.status == "notGoing").map((guest) => guest.Guest);
      const unknown = guests.filter((guest) => guest.status == "unknown").map((guest) => guest.Guest);
      res.status(200).send({
        going,
        notSure,
        notGoing,
        unknown,
      });
    })
    .catch(() => {
      res.send([]);
    });
});

module.exports = { getGuests };
