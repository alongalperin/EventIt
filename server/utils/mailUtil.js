var nodemailer = require('nodemailer');

let mailSender = function(to, eventId, guestId) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.gmail_usernname,
            pass: process.env.gmail_password
        }
    });

    let url = process.env.URL;
    
    if (guestId) { // this is mail for inviting guest
        var mailOptions = {
        from: 'eventit2018@gmail.com',
        to: to,
        subject: 'You are invited to an event',
        html:  `<h2>Hi, you are invited to an event. All the details in link:</h2> <br/> 
                <a href="${url}guest.html?eventId=${eventId}&guestId=${guestId}">Come</a>`
        };
    }
    

    if (!guestId) {// this is mail for manage
        var mailOptions = {
            from: 'eventit2018@gmail.com',
            to: to,
            subject: 'Your new event details',
            html:  `<h2>You created an event</h2> <h3> here is a link for managing:</h3> 
                    <a href="${url}manage.html?manageId=${eventId}">Manage Event</a> <br/>
                    <img src="http://clipartstation.com/wp-content/uploads/2017/11/event-clipart-7.jpg">`
        };
    }


    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { mailSender };