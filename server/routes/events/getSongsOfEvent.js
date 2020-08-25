const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");

const router = express.Router();

const getSongsOfEvent = router.get("/event/songs/:eventId", async function (
  req,
  res
) {
  try {
    const eventId = req.params.eventId;

    let songs = await SongsInEvents.findAll({
      where: { eventId: eventId },
      attributes: ["id", "songId", "likesCounter"],
    });
    res.status(200).send(songs);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = { getSongsOfEvent };
