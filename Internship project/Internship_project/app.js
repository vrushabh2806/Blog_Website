require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');  
const session = require('express-session');
//const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');
const app = express();
app.use(express.static('public'));
const path = require("path")
app.use(expressLayout);
app.set('layout', './layouts/main');

app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

const mongoose = require('mongoose');

main().then(() => {
  console.log("connections Established")
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blog_website');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



app.listen(8080, () => {
  console.log(`app lisrening on port 8080`)
})