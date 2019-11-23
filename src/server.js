console.log("Hello World!");
const express = require('express');
const server = express();
const data = require('./data');
const body_parser = require('body-parser');

server.use(body_parser.json());

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

  res.sendStatus(200);
});

const port = 4000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});



