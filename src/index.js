const express = require('express');
const app = express();

const url = `https://newsapi.org/v2/sources?apiKey=1d8434c04862439692cc773aa6bfc026`;

app.get(url, function (req, res) {
  res.json();
});

app.listen(3000);
