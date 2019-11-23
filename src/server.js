console.log("Hello World!");
const express = require('express');
const server = express();
const data = require('./data');

server.get("/news", (req, res) => {
  res.json(data);
});

server.get("/news/:id", (req, res) => {
  const newsId = req.params.id;
  const news = data.find(item => item.id === newsId);

  if (news) {
    res.json(news);
  } else {
    res.sendStatus(404);
  }
});

server.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 4000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});



