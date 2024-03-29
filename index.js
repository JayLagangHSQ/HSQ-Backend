const dotenv = require('dotenv').config();
const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/user");
const form = require("./routes/form");
const article = require("./routes/article");
const link = require("./routes/link")
const newsAndUpdate = require("./routes/newsAndUpdate")
const mail = require("./routes/mail")
const hr = require("./routes/hr")
const formBuilder = require("./routes/formBuilder")
const shoutout = require("./routes/shoutout");
// const {instantaneous} = require('./util/instantaneous')
const app = express();
const port = 4005;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
	origin: '*'
}))

app.use(session({
  secret: dotenv.parsed.sessionSecret,
  resave: true,
  saveUninitialized: true
}));

// Database connection
const mongodbPass = dotenv.parsed.MONGO_DB_ADMIN_PASS;
const dataBase = dotenv.parsed.DATABASE;

mongoose.connect(`mongodb+srv://hsq_client:${mongodbPass}@hsq-db.rmjltpr.mongodb.net/${dataBase}?retryWrites=true&w=majority`);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("We're connected to the cloud database"));

app.use("/api/users", user);
app.use('/api/forms', form);
app.use('/api/articles', article);
app.use('/api/links', link)
app.use('/api/newsAndUpdates', newsAndUpdate)
app.use('/api/mails', mail);
app.use('/api/hr/users', hr);
app.use('/api/formBuilder', formBuilder);
app.use('/api/shoutouts', shoutout);
//socket.io middleware for real-time features
// instantaneous();

if(require.main === module) {
  app.listen(port, () => console.log(`Server is running at port ${port}`));
}

module.exports = app;
