const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");
const { LikesToSongs } = require("../../db/Models/LikesToSongs");

const router = express.Router();

//POST /event/removeLike    remove like that guest get to song in event
const removeLikeFromSong = router.post(
  "/event/removeLike/:eventId/:guestId/:songInEventId",
  async function (req, res) {
    try {
      const { eventId, guestId, songInEventId } = req.params;

      // decrease song like counter
      await SongsInEvents.findOne({
        where: {
          id: songInEventId,
        },
      }).then((songInEvent) => {
        return songInEvent.decrement("likesCounter", { by: 1 }); // decrease in 1
      });

      await LikesToSongs.destroy({
        where: {
          songInEventId: songInEventId,
        },
      });

      res.status(200).send();
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = { removeLikeFromSong };
