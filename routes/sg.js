const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_API_KEY);

let scheduledEmails = {};

router.get("/send-test-email", async (req, res) => {
  const msg = {
    // to: "rakibkhan314@outlook.com", // Change to your recipient
    // from: "rakibkhan@live.co.uk", // Change to your verified sender

    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors...",
    },
    to: "rakibkhan@live.co.uk", // Change to your verified sender

    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/lp-contact-us", async (req, res) => {
  const { email, name, message } = req.body;

  const msg = {
    // to: "rakibkhan314@outlook.com", // Change to your recipient
    // from: "rakibkhan@live.co.uk", // Change to your verified sender

    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors",
    },
    to: "rakibkhan@live.co.uk", // Change to your verified sender

    subject: `Contact Us from ${name} ${email}`,
    text: message,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/booking-request-received", async (req, res) => {
  let { tutorEmail, studentName, lesson, lessonTime, price } = req.body;

  const msg = {
    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors Team",
    },
    to: tutorEmail, // Change to your verified sender

    templateId: "d-9f91fb96719543cbb45c3341dcda357f",
    dynamic_template_data: { studentName, lesson, lessonTime, price },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/booking-request-accepted", async (req, res) => {
  let { studentEmail, tutorName, subject, date } = req.body;

  const msg = {
    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors Team",
    },
    to: studentEmail, // Change to your verified sender

    templateId: "d-b6e0de8b6f484f53aeacf25104b7792f",
    dynamic_template_data: { tutorName, subject, date },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/booking-request-declined", async (req, res) => {
  let { studentEmail, tutorName, subject, date } = req.body;

  const msg = {
    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors Team",
    },
    to: studentEmail, // Change to your verified sender

    templateId: "d-852dc85e9a7740499e97368edc4f2174",
    dynamic_template_data: { tutorName, subject, date },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/booking-request-cancelled", async (req, res) => {
  let { tutorEmail, studentName, lesson, time } = req.body;

  const msg = {
    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors Team",
    },
    to: tutorEmail, // Change to your verified sender

    templateId: "d-690e370db4f44d64a8311e514af4a467",
    dynamic_template_data: { studentName, lesson, time },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/booking-cancelled", async (req, res) => {
  let { toEmail, userName, subject, date } = req.body;

  const msg = {
    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors Team",
    },
    to: toEmail, // Change to your verified sender

    templateId: "d-8aff5a3711cd40fab437e54060fc0f89",
    dynamic_template_data: { userName, subject, date },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/message-received", async (req, res) => {
  let { toEmail, userName } = req.body;

  const msg = {
    from: {
      email: "tutors@rktutors.co.uk", // Change to your recipient
      name: "RKTutors Team",
    },
    to: toEmail, // Change to your verified sender

    templateId: "d-4ffccec8fe5c4044ade4bd490a4f0beb",
    dynamic_template_data: { userName },
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

router.post("/portfolio-contact", async (req, res) => {
  let { firstName, lastName, email, phone, message } = req.body;

  console.log({ firstName, lastName, email, phone, message });

  const msg = {
    from: "rakibkhan@live.co.uk",
    to: "rakibkhan@live.co.uk", // Change to your verified sender

    subject: "New Portfolio Contact",
    text: `First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}, Phone: ${phone}, Message: ${message}`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
    res.json({ success: true, message: "sent email" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

module.exports = router;
