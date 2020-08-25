const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");
const { LikesToSongs } = require("../../db/Models/LikesToSongs");

const router = express.Router();

// POST /event/addLike  add like to song
const addLikeToSong = router.post(
  "/event/addLike/:eventId/:guestId/:songInEventId",
  async function (req, res) {
    try {
      const { eventId, guestId, songInEventId } = req.params;

      // increase song like counter
      await SongsInEvents.findOne({
        where: {
          id: songInEventId,
        },
      }).then((songInEvent) => {
        return songInEvent.increment("likesCounter", { by: 1 });
      });

      await LikesToSongs.create({
        guestId: guestId,
        eventId: eventId,
        songInEventId: songInEventId,
      });

      res.status(200).send();
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

module.exports = { addLikeToSong };
