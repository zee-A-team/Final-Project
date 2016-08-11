
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const animalSchema = new Schema({
  commonName: String,
  scientificName: String,
  extinctionDate: Number,
  range: String,
  description: String,
  animalType: String
});

module.exports = mongoose.model('animals', animalSchema);