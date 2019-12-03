const express = require('express');
let data = require('./data');
const body_parser = require('body-parser');
const winston = require('winston');
const  expressWinston = require('express-winston');
const server = express();
const News = require('./mongoJs');
const jsonParser = express.json();

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

server.post("/api/news", (req, res) => {
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

server.put("/api/news",(req, res) => {
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



const port = 4000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});



