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



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
