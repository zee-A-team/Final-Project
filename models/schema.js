const mongoose = require('mongoose');
const Animals = require('./Animal.js');
const {graphql} = require('graphql');
const {getSchema} =  require('@risingstack/graffiti-mongoose');

const schema = getSchema(Animals);

module.exports = schema;