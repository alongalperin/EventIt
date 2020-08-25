var nodemailer = require("nodemailer");

let mailSenderService = function (to, eventId, guestId) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.gmail_usernname,
      pass: process.env.gmail_password,
    },
  });

  let url = process.env.URL;

  if (guestId) {
    // this is mail for inviting guest
    var mailOptions = {
      from: "eventit2018@gmail.com",
      to: to,
      subject: "You are invited to an event!",
      html: `<center>
                <h2>Hi, you are invited to an event! All the details in link:</h2> <br/> 
                <a href="${url}guest.html?eventId=${eventId}&guestId=${guestId}">Link</a> <br/><br/>
                <img src="https://imgbbb.com/images/2019/03/30/alcohol-1281704_640.jpg">
                </center>`,
    };
  }

  if (!guestId) {
    // this is mail for manage
    var mailOptions = {
      from: "eventit2018@gmail.com",
      to: to,
      subject: "Your new event details",
      html: `<center>
                    <h2>Congratulations! You created an event</h2> <h3> here is a link for managing:</h3> 
                    <a href="${url}manage.html?manageId=${eventId}">Manage Event</a> <br/>
                    <img src="https://imgbbb.com/images/2019/03/30/people-2608316_640.jpg">
                    </center>`,
    };
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { mailSenderService };
