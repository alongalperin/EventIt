// run config file that sets env variables
require('./config/config');

const path           =  require('path');
const express        =  require('express');
const bodyParser     =  require('body-parser');
const randomId       =  require("random-id");
const { mailSender } =  require("./utils/mailUtil");

const Sequelize      = require('sequelize');
let { sequelize }    = require('./db/Sequelize');

const port = process.env.PORT || 3000;
let app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));


// definition of Event table
const { Event } = require('./db/Models/Event');

// definition of Guest table
const { Guest } = require('./db/Models/Guest');

// definition of guests in event table. many to many
const { GuestEvents } = require('./db/Models/GuestEvents');

// definition of songs in events table. many to many
const { SongsInEvents } = require('./db/Models/SongsInEvents');

// definition of likes to songs table. many to many. each like a user give recorded in this table
const { LikesToSongs } = require('./db/Models/LikesToSongs');


// initialize db. run only when  initDB() run bellow. usually the invoke line will be in comment
let initDB = function(){ sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function() {
        return sequelize
            .sync({
                force: true
            });
    })
    .then(function() {
        return sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(function() {
        console.log('Database synchronised.');
    }, function(err) {
        console.log(err);
    });
};

// RESET THE DB
// initDB();

//POST /event  # create new event
app.post('/event', function (req, res) {
    // manageId is event id number that is used to manage only, the main use is with
    // the url that look like- manage/event/:manageId
    let manageId = randomId(18,"0");
    let eventId = randomId(10,"0");
    let ownerEmail = req.body.ownerEmail;

    Event.create({
        id: eventId, // the id is the same as the eventID
        manageId,
        eventId,
        ownerEmail: req.body.ownerEmail,
        name: req.body.name,
        date: req.body.date,
        address: req.body.address,
        lng: req.body.lng,
        lat: req.body.lat
    })
    .then(() => {
        mailSender(ownerEmail, manageId);
    });

    res.status(200).send(manageId);
});


//POST /event/addGuest  # add guest to event
app.post('/event/addGuest', async function (req, res) {
    let guestId = randomId(10,"0");
    let manageId = req.body.manageId;
    let guestEmail = req.body.email;
    
    try {
        // we have the manageId and we what the eventId
        let eventId = await Event.findOne({
            where: { manageId : manageId},
            attributes: ['eventId']
        });
        eventId = eventId.eventId; // get eventId property

        let newGuest = await Guest.create({
                id: guestId,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email
        });

        let userInEvent = await GuestEvents.create({
                GuestId : guestId,
                EventId : eventId,
                manageId : manageId,
                status : "unknown"
        });

        mailSender(guestEmail, eventId, guestId);
        res.status(200).send(newGuest);
    } catch(e) {
        res.status(500).send();
    }
});

// POST /event/addSong    add song to event playlist
app.post('/event/addSong/:eventId/:songId', async function(req, res) {
    try {
        const eventId = req.params.eventId;
        const songId = req.params.songId;

        let newSong = await SongsInEvents.create({
            eventId : eventId,
            songId : songId,
            likesCounter: 0
        });

        res.status(200).send(newSong);
    }catch(e) {
        res.status(500).send(e);
    }
});

// GET /event/songs/   get songs list of event
app.get('/event/songs/:eventId', async function(req,res) {
    try {
        const eventId = req.params.eventId;

        let songs = await SongsInEvents.findAll({
            where: {eventId: eventId},
            attributes: ['id','songId','likesCounter']
        });
        res.status(200).send(songs);
    } catch (e) {
        res.status(500).send();
    }
});

// POST /event/addLike  add like to song
app.post('/event/addLike/:eventId/:guestId/:songInEventId', async function(req,res) {  
    try {
        const eventId = req.params.eventId;
        const guestId = req.params.guestId;
        const songInEventId = req.params.songInEventId;

        // increase song like counter
        await SongsInEvents.findOne({
            where: {
                id: songInEventId
            }
        }).then((songInEvent) => {
            return songInEvent.increment('likesCounter', {by: 1})
        });

        await LikesToSongs.create({
            guestId: guestId,
            eventId: eventId,
            songInEventId: songInEventId
        });

        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});


// POST /event/removeLike    remove users like to song
app.post('/event/removeLike/:eventId/:guestId/:songInEventId', async function(req,res) {
    try {
        const eventId = req.params.eventId;
        const guestId = req.params.guestId;
        const songInEventId = req.params.songInEventId;
        
        // decrease song like counter
        await SongsInEvents.findOne({
            where: {
                id: songInEventId                
            }
        }).then((songInEvent) => {
            return songInEvent.decrement('likesCounter', {by: 1}) // decrease in 1
        });

        await LikesToSongs.destroy({
            where: {
                songInEventId: songInEventId
            }
        });

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

// DELETE /event/enentSong  delete song from event
app.delete('/event/song', async function(req,res) {
    console.log('detelet song');
    console.log( req.body );
    
    try {
        let songInEventId = parseInt(req.body.songEventId, 10);
        await SongsInEvents.destroy({
            where: {
                id: songInEventId
            }
        });

        res.status(200).send();
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// GET /event/songsLikedByUser   get songs that the user liked for specific event
app.get('/event/songsLikedByUser/:eventId/:guestId/', async function(req,res) {
    try {
        const eventId = req.params.eventId;
        const guestId = req.params.guestId;
        
        await LikesToSongs.findAll({
            where: {
                eventId: eventId,
                guestId: guestId
            },
            attributes: ['songInEventId']
        }).then((likedSongs) => {
            res.status(200).send(likedSongs);            
        });
    } catch (e) {
        res.status(500).send();
    }
});


//POST /event/updateGuestStatus    update guest status to event
app.post('/guest/updateGuestStatus/', function (req, res) {
    let guestId = req.body.guestId;
    let eventId = req.body.eventId;
    let newStatus = req.body.newStatus;

    GuestEvents.update(
        // Set status value
        { status: newStatus },
        // Where clause / criteria 
        { where: {EventId : eventId , GuestId : guestId } }
        )
        .then(function() {
        res.status(200).send();
        })
        .catch(function(err) { 
        res.status(500).send();
            //handle error here
        });
});


// GET /guest/getGuestData/
app.get('/guest/getGuestData/:eventId/:guestId', async function(req, res) {
    let guestId = req.params.guestId;
    let eventId = req.params.eventId;

    try {
        let guest = await GuestEvents.findOne({
            where: { eventId : eventId, guestId : guestId},
            include: [Guest]
        });

        res.status(200).send({
            status: guest.status,
            firstname: guest.Guest.firstname,
            lastname: guest.Guest.lastname
        });
    } catch (e) {
        res.status(404).send();
    }
});

// GET ///event/:eventId    returns event instance
// function can get manageId or eventId
app.get('/event/:eventId', function (req, res) {
    let eventId = req.params.eventId;
    let query = {}
    
    if (checkValidId(eventId, 10)) { // we have event guest 
        query = {
            eventId : eventId
        }
    } else if (checkValidId(eventId, 18)) { // we have event manager  
        query = {
            manageId : eventId
        }
    } else { // invalid id
        res.status(404).send();
    }

    Event.findOne({ where: query }).then(event => {
        if (event) {
            res.status(200).send(event);
        } else {
            res.status(404).send();
        }
    });
});


// GET /event/getGuests/    return lists of guests with all 4 posible statuses
app.get('/event/getGuests/:manageId', function(req, res){
    let manageId = req.params.manageId;

    GuestEvents.findAll({
        where: {
            manageId
        },
        include: [{
            model: Guest
        }]
    }).then((guests) => {
        let going = guests.filter(guest => guest.status == 'going').map(guest => guest.Guest);
        let notSure = guests.filter(guest => guest.status == 'notSure').map(guest => guest.Guest);
        let notGoing = guests.filter(guest => guest.status == 'notGoing').map(guest => guest.Guest);
        let unknown = guests.filter(guest => guest.status == 'unknown').map(guest => guest.Guest);
        res.status(200).send({
            going, 
            notSure,
            notGoing,
            unknown
        });
    }).catch(() => {
        res.send([]);
    });
});


function checkValidId(id, requiredLength){
    return id != undefined && id.length == requiredLength && /^\d+$/.test(id);
}

app.listen(port, () => {
    console.log(`Started up at ${port}`);
}); 

module.exports = { app };