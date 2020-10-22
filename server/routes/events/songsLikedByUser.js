const express = require("express");

const { LikesToSongs } = require("../../db/Models/LikesToSongs");

const router = express.Router();

// GET /event/songsLikedByUser   get songs that the user liked for specific event
const songsLikedByUser = router.get("/events/likes/:guestId/", async function (req, res) {
  try {
    const { guestId } = req.params;

    await LikesToSongs.findAll({
      where: {
        guestId: guestId,
      },
      attributes: ["songInEventId"],
    }).then((likedSongs) => {
      res.status(200).send(likedSongs);
    });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = { songsLikedByUser };
