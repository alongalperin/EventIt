const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");
const { LikesToSongs } = require("../../db/Models/LikesToSongs");

const router = express.Router();

//POST /event/removeLike    remove like that guest get to song in event
const removeLikeFromSong = router.post("/events/removeLike", async function (req, res) {
  try {
    const { guestId, songId } = req.body;
    await SongsInEvents.findByPk(songId).then((songInEvent) => {
      return songInEvent.decrement("likesCounter", { by: 1 }); // decrease in 1
    });

    await LikesToSongs.destroy({
      where: {
        guestId,
        songInEventId: songId,
      },
    });

    const updatedSong = await SongsInEvents.findByPk(songId);
    res.status(200).send(updatedSong);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = { removeLikeFromSong };
