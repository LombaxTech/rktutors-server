const express = require("express");
const app = express();
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server of rktutors");
});

app.use("/stripe", require("./routes/stripe"));
app.use("/sg", require("./routes/sg"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
