const express = require("express");
const { SongsInEvents } = require("../../db/Models/SongsInEvents");
const { LikesToSongs } = require("../../db/Models/LikesToSongs");

const router = express.Router();

// POST /event/addLike  add like to song
const addLikeToSong = router.post("/events/addLike/", async function (req, res) {
  const { eventId, guestId, songId } = req.body;
  try {
    // increase song like counter
    await SongsInEvents.findByPk(songId).then((songInEvent) => {
      return songInEvent.increment("likesCounter", { by: 1 });
    });

    await LikesToSongs.create({
      guestId: guestId,
      eventId: eventId,
      songInEventId: songId,
    });

    const updatedSong = await SongsInEvents.findByPk(songId);
    res.status(200).send(updatedSong);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

module.exports = { addLikeToSong };
