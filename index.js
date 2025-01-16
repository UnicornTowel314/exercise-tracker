const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser");

let mongoose;
try{
  mongoose = require("mongoose");
}catch (err) {
  console.log(err);
}
const Schema = mongoose.Schema;

// Mongoose set up
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new Schema({
  username: {type: String, required: true}
});
let userModel = mongoose.model("user", userSchema);

// Exercise Schema
const exerciseSchema = new Schema({
  userId: {type: String, required: true},
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: {type: Date, default: new Date()}
});
let exerciseModel = mongoose.model("exercise", exerciseSchema);

app.use(cors())
app.use(express.static('public'))
app.use("/", bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", (req, res) => {
  let username = req.body.username;
  let newUser = userModel({ username: username });
  newUser.save();
  res.json(newUser);
});

app.get("/api/users", (req, res) => {
  userModel.find({}).then((users) => {
    res.json(users);
  })
});

app.post("/api/users/:id/exercises", (req, res) => {
  let userId = req.params._id;
  exerciseObj = {
    userId: userId,
    description: req.body.description,
    duration: req.body.duration
  }

  if (req.body.date != "") {
    exerciseObj.date = req.body.date;
  }

  let newExercise = new exerciseModel(exerciseObj);

  userModel.findById(userId, (err, userFound) => {
    if (err) {
      console.log(err);
    }

    newExercise.save();
    res.json({
      _id: userFound._id,
      username: userFound.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: new Date(newExercise.date).toDateString()
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
