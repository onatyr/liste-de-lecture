// import {generateTimeline} from 'generateTimeline'
const express = require("express");
const mongoose = require("mongoose");
const Film = require("./models/film");
const Book = require("./models/book");
const bodyParser = require("body-parser");
const app = express();
const generateTimeline = require("./generateTimeline");

mongoose
  .connect(
    "mongodb+srv://onatrigault:lestat@clusterlater.ekjrhqs.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.post("/api/films", (req, res, next) => {
  delete req.body._id;
  const film = new Film({
    ...req.body,
  });
  film
    .save()
    .then(() => {
      res.status(201).json({ film });
    })
    .catch((error) => res.status(400).json({ error }));
});

app.post("/api/books", (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ book });
    })
    .catch((error) => res.status(400).json({ error }));
});

app.delete("/api/films/:id", (req, res, next) => {
  Film.deleteOne({ _id: req.params.id })
    .then((film) => {
      console.log(req.params.id, " supprimé");
      res.status(200).json({ film, message: "Deleted" });
    })
    .catch((error) => res.status(400).json({ error }));
});

app.get("/api", (req, res, next) => {
  let promises = new Array ()
  promises.push(Film.find())
  promises.push(Book.find())
    Promise.all(promises).then((all) => {
      console.log(all[1])
      let results = all[0].concat(all[1])
      generateTimeline(results);
      res.status(200).json({ results });
    })
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
