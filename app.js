const express = require("express");
const app = express();
const cors = require("cors");

const { google } = require("googleapis");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const scopes = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
];

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server of rktutors");
});

app.get("/gen-auth-link", async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    res.json(url);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post("/gen-tokens", async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.json(tokens);
  } catch (error) {
    console.log(error);
    res.jeson(error);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
