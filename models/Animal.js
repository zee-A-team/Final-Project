const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const animalSchema = new Schema({
  _id: String,
  common_name: String,
  scientific_name: String,
  date: Number,
  Range: String,
  Description: String,
  Type: String,
  latitude: Number,
  longitude: Number,
  latlong: Number,
  country: String,
  continent: String,
});

module.exports = mongoose.model('animals', animalSchema);
