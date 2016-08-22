const Animals = require('./Animal');
const { getSchema } = require('@risingstack/graffiti-mongoose');

const schema = getSchema(Animals);

module.exports = schema;
