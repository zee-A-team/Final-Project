'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Animal = require('./models/Animal');
const PORT = process.env.PORT || 3000;


const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config');
const compiler = webpack(config);
/*----------  MONGOOSE ORM SETUP   ----------*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/et');
const db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));
db.once('open', _ => console.log("Mongo reporting for duty!"));

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
    stats: {
    colors: true,
  }
}));

app.get( '/test', ( req, res ) => {
    Animal.find( ( err, animals ) => {
      if (err) res.send(err);
      return res.json(animals);
    });
  });

app.post( '/test', ( req, res ) => {
    var animal = new Animal();
    animal.commonName = req.body.commonName;
    animal.save( ( err ) => {
      if (err) return res.send(err);
      return res.send(animal);
    });
  });

app.listen(PORT, _ => console.log(`Now listening on PORT ${PORT}`));