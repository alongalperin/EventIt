const express = require("express");

const { SongsInEvents } = require("../../db/Models/SongsInEvents");

const router = express.Router();

const removeSongFromEvent = router.delete(`/events/song/:songId`, async function (req, res) {
  console.log(req.params.songId);

  try {
    let songInEventId = parseInt(req.params.songId, 10);
    await SongsInEvents.destroy({
      where: {
        id: songInEventId,
      },
    });

    res.status(200).send();
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e.message);
  }
});

module.exports = { removeSongFromEvent };
