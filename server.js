'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Animal = require('./models/Animal');
const PORT = process.env.PORT || 3001;
const graffiti = require('@risingstack/graffiti');
const schema = require('./models/schema.js');



/*----------  MONGOOSE ORM SETUP   ----------*/
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/et');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', _ => console.log("Mongo reporting for duty!"));

mongoose.Promise = global.Promise;


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(graffiti.express({
  schema
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
//http://api.gbif.org/v1/species/search?isExtinct=true
