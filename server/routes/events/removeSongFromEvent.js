const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");

const router = express.Router();

const removeSongFromEvent = router.delete("/event/song", async function (
  req,
  res
) {
  try {
    let songInEventId = parseInt(req.body.songEventId, 10);
    await SongsInEvents.destroy({
      where: {
        id: songInEventId,
      },
    });

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = { removeSongFromEvent };
