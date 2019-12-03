const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/news', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

let newsSchema = new mongoose.Schema({
  name: String,
  genre: String,
  id: String
});
let News = mongoose.model('News', newsSchema);

module.exports = News;
