const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server of rktutors");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));