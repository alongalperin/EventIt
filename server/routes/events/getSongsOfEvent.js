const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");

const router = express.Router();

const getSongsOfEvent = router.get("/events/songs/:eventId", async function (req, res) {
  try {
    const eventId = req.params.eventId;
    let songs = await SongsInEvents.findAll({
      where: { eventId: eventId },
      attributes: ["id", "youtubeId", "likesCounter"],
      order: [["likesCounter", "DESC"]],
    });
    res.status(200).send(songs);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = { getSongsOfEvent };
