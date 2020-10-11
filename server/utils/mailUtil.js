var nodemailer = require("nodemailer");

let mailSenderService = function (to, eventId, guestId) {
  console.log("username: " + process.env.gmail_usernname);
  console.log("gmail_password: " + process.env.gmail_password);

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
                <h3><a href="${url}guest.html?eventId=${eventId}&guestId=${guestId}">Link</a></h3> <br/><br/>
                <img style="width: 60vw; height: 80vh" src="https://github.com/alongalperin/EventIt/blob/master/public/img/email_image.jpg?raw=true" />
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
                    <h3><a href="${url}manage.html?manageId=${eventId}">Manage Event</a></h3> <br/>
                    <img style="width: 60vw; height: 80vh" src="https://github.com/alongalperin/EventIt/blob/master/public/img/email_image.jpg?raw=true" />
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
