console.log("Hello World!");
const express = require('express');
const server = express();
let data = require('./data');
const body_parser = require('body-parser');
const winston = require('winston');
const  expressWinston = require('express-winston');

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
  res.json(data);
});

server.get("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  const news = data.find(item => item.id === newsId);
  if (news) {
    res.json(news);
  } else {
    res.sendStatus(404);
  }
});

server.post("/api/news", (req, res) => {
  const news = req.body;
  console.log('Adding a news: ', news);

  data.push(news);

  res.sendStatus(201);
});

server.put("/api/news/:id", (req, res) => {
  const newsId = req.params.id;
  const news = req.body;
  console.log("Editing news: ", newsId, " to be ", news);

  const updatedListNews = [];
  data.forEach(oldNews => {
    if (oldNews.id === newsId) {
      updatedListNews.push(news);
    } else {
      updatedListNews.push(oldNews);
    }
  });

  data = updatedListNews;

  res.sendStatus(200);
});

server.delete("/api/news/:id", (req, res) => {
  const newsId = req.params.id;

  console.log("Delete news with id: ", newsId);

  const filtered_list = data.filter(news => news.id !== newsId);

  data = filtered_list;

  res.sendStatus(200);
});

server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!')
});



const port = 4000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});



