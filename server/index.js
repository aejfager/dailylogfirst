const express = require("express");
const cors = require("cors");
const monk = require("monk");

const app = express();

const db = monk("localhost/dailylog");
const dailylogs = db.get("dailylogs");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "logged!!"
  });
});

app.get("/dailylogs", (req, res) => {
  dailylogs.find().then(dailylogs => {
    res.json(dailylogs);
  });
});

function isValidDailylog(dailylog) {
  return (
    dailylog.username &&
    dailylog.username.toString().trim() !== "" &&
    dailylog.discussion &&
    dailylog.discussion.toString().trim() !== ""
  );
}

//Listening posts of data to /dailylogs, and if it's a valid daily log we'll create an object (toString for security) then inserting that that into the DB with a collection. Once it's inserted we respond with what's inserted.

app.post("/dailylogs", (req, res) => {
  if (isValidDailylog(req.body)) {
    const dailylog = {
      username: req.body.username.toString(),
      discussion: req.body.discussion.toString(),
      created: new Date()
    };

    dailylogs.insert(dailylog).then(CreatedDailylog => {
      res.json(CreatedDailylog);
    });
  } else {
    res.status(422);
    res.json({
      message: "Hey! Name and content are required"
    });
  }
});

app.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
