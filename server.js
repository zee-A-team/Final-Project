const express = require('express');
const bodyParser = require('body-parser');
const Animal = require('./models/Animal');
const graffiti = require('@risingstack/graffiti');
const schema = require('./models/schema');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');
const mongoose = require('mongoose');
const dataUpdater = require('./data-updater.js');

const app = express();
const PORT = process.env.PORT || 3001;
const compiler = webpack(config);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/et');
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.get('/', (req, res) => res.sendFile('public/index.html'));

app.use(graffiti.express({
  schema,
}));

app.get('/test', (req, res) => {
  Animal.find((err, animals) => {
    if (err) res.send(err);
    return res.json(animals);
  });
});

app.post('/test', (req, res) => {
  const animal = new Animal();
  animal.commonName = req.body.commonName;
  animal.save((err) => {
    if (err) return res.send(err);
    return res.send(animal);
  });
});

app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
