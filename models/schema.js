const Animals = require('./Animal.js');
const {getSchema} =  require('@risingstack/graffiti-mongoose');

const schema = getSchema(Animals);

module.exports = schema;