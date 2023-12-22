const dotenv = require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/user");
const form = require("./routes/form")

const app = express();
const port = 4005;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
	origin: '*'
}))


// Database connection
const mongodbPass = dotenv.parsed.MONGO_DB_ADMIN_PASS;
const dataBase = dotenv.parsed.DATABASE;

mongoose.connect(`mongodb+srv://hsq_client:${mongodbPass}@hsq-db.rmjltpr.mongodb.net/${dataBase}?retryWrites=true&w=majority`);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("We're connected to the cloud database"));

app.use("/api/users", user);
app.use('/api/forms', form);

setInterval(() => {
  console.log(`interval`)
}, 1000);

if(require.main === module) {
  app.listen(port, () => console.log(`Server is running at port ${port}`));
}

module.exports = app;
