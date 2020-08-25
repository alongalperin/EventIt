const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");

const router = express.Router();

// POST /event/addSong    add song to event playlist
const addSong = router.post("/event/addSong/:eventId/:songId", async function (
  req,
  res
) {
  try {
    const { eventId, songId } = req.params;

    let newSong = await SongsInEvents.create({
      eventId: eventId,
      songId: songId,
      likesCounter: 0,
    });

    res.status(200).send(newSong);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = { addSong };
