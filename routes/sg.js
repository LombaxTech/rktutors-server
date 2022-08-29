const express = require("express");
const router = express.Router();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG_API_KEY);

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

module.exports = router;
