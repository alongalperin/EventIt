const { Router } = require('express');

const { createEvent } = require("./events/createEvent");
const { getEvent } = require("./events/getEvent");
const { addGuest } = require("./events/addGuest");
const { addSong } = require("./events/addSong");
const { getSongsOfEvent } = require("./events/getSongsOfEvent");
const { addLikeToSong } = require("./events/addLikeToSong");
const { removeLikeFromSong } = require("./events/removeLikeFromSong");
const { removeSongFromEvent } = require("./events/removeSongFromEvent");
const { songsLikedByUser } = require("./events/songsLikedByUser");
const { getGuests } = require("./events/getGuests");

const { updateGuestStatus } = require("./guests/updateGuestStatus");
const { getGuestData } = require("./guests/getGuestData");

const router = Router();

router.use(createEvent);
router.use(getEvent);
router.use(addGuest);
router.use(addSong);
router.use(getSongsOfEvent);
router.use(addLikeToSong);
router.use(removeLikeFromSong);
router.use(removeSongFromEvent);
router.use(songsLikedByUser);
router.use(getGuests);
router.use(updateGuestStatus);
router.use(getGuestData);


module.exports = router;