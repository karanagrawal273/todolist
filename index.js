const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const task = mongoose.model("task", taskSchema);

//Read
app.get("/", (req, res) => {
  task.find({}, function (err, data) {
    if (err) res.send(err);
    else res.render("todo", { tasks: data });
  });
});

//Create
app.post("/", (req, res) => {
  const t1 = new task({
    title: req.body.title,
    description: req.body.description,
  });
  t1.save((err, task) => {
    if (err) res.send(err);
    else res.redirect("/");
  });
});

//Update
app.get("/edit/:id", (req, res) => {
  var id = req.params.id;

  task.find({ id }, function (err, data) {
    if (err) res.send(err);
    else res.render("edit", { tasks: data, id: id });
  });
});
//Update
app.post("/edit/:id", (req, res) => {
  var id = req.params.id;

  task.findByIdAndUpdate(
    id,
    { title: req.body.title, description: req.body.description },
    (err, data) => {
      if (err) res.send(err);
      else res.redirect("/");
    }
  );
});

//Delete
app.get("/delete/:id", (req, res) => {
  var id = req.params.id;

  task.deleteOne({ _id: req.params.id }, function (err) {
    if (err) res.send(err);
    else res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
