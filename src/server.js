const express = require('express');
let data = require('./data');
const body_parser = require('body-parser');
const winston = require('winston');
const  expressWinston = require('express-winston');
const server = express();
const News = require('./mongoJs');
const jsonParser = express.json();

// ------------Passport----------------
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user');

// Connect to DB
// mongoose.connect('mongodb://localhost/loginapp');
// const db = mongoose.connection;

// BodyParser Middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// Express Session
server.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
server.use(passport.initialize());
server.use(passport.session());

// Register User
server.post('/api/register', function(req, res){
  let password = req.body.password;
  let password2 = req.body.password2;

  if (password == password2){
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      res.send(user).end()
    });
  } else{
    res.status(500).send("{errors: \"Passwords don't match\"}").end()
  }
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });
  }
));

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

const authenticate = passport.authenticate('local');
const mustAuthenticate = (req, res, next) => {
  if(!req.isAuthenticated()){
    return res.sendStatus(401); // code "Unauthorized";
  }
  next();
};

// Endpoint to login
server.post('/api/login',
  authenticate,
  function(req, res) {
    res.json(req.user);
  }
);

// Endpoint to get current user
server.get('/api/user', mustAuthenticate, function(req, res){
  res.send(req.user);
});


// Endpoint to logout
server.get('/api/logout', mustAuthenticate, function(req, res){
  req.logout();
  res.send(null)
});

server.get('/auth/facebook', passport.authenticate('facebook'), (req, res) => {
  console.log(req);
  res.json(req);
});

server.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

// ------------Passport----------------
server.use(body_parser.json());

server.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
}));

server.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.get("/api/news", (req, res) => {
  News.find({}, function(err, news){
    if(err) return console.log(err);
    res.json(news)
  });
});

server.get("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  News.findOne({id: newsId}, function(err, news){

    if(err) return console.log(err);
    res.send(news);
  });
});

server.post("/api/news", mustAuthenticate, (req, res) => {
  const news = req.body;
  console.log('Adding a news: ', news);

  const newsName = req.body.name;
  const newsGenre = req.body.genre;
  const newsId = req.body.id;
  const user = new News({name: newsName, genre: newsGenre, id: newsId});

  user.save(function(err){
    if(err) return console.log(err);
    res.sendStatus(201);
  });

});

server.put("/api/news", mustAuthenticate, (req, res) => {
  if(!req.body) return res.sendStatus(400);

  News.findOneAndUpdate({id: 'tt0110357'}, { $set: { name: req.body.name, genre: req.body.genre}},
    {new: true}, function(err){
    if(err) return console.log(err);
    res.sendStatus(200);
  });
});

server.delete("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  News.findOneAndDelete( {id: newsId}, function(err){

    if(err) return console.log(err);
    res.sendStatus(200);
  });
});

server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});



server.listen(4000, () => {
  console.log(`Server listening at 4000`);
});



