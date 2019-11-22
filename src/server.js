console.log("Hello World!");
const express = require('express');
const server = express();

server.get("/json", (req, res) => {
  res.json({ message: "Hello world" });
});

server.get("/", (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = 4000;

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

// let data = require('./data');
//
// server.get("/items", (req, res) => {
//   res.json(data);
// });
//
// server.get("/items/:id", (req, res) => {
//   const itemId = req.params.id;
//   const item = data.find(_item => _item.id === itemId);
//
//   if (item) {
//     res.json(item);
//   } else {
//     res.json({ message: `item ${itemId} doesn't exist`})
//   }
// });

