'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Animal = require('./models/Animal');
const PORT = process.env.PORT || 3000;


/*----------  MONGOOSE ORM SETUP   ----------*/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/et');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connect error:"));
db.once('open', () => {
  console.log("Mongo reporting for duty!");
});
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/api', (req, res) => {
  var req = new XMLHttpRequest();
  req.open('GET', '');
  req.send();
});

app.get( '/test', ( req, res ) => {
    Animal.find( ( err, animals ) => {
      if (err) res.send(err);
      res.json(animals);
    });
  })

app.post( '/test', ( req, res ) => {
    var animal = new Animal();
    animal.commonName = req.body.commonName;
    animal.save( ( err ) => {
      if (err) return res.send(err);
      res.send(animal);
    });
  });

app.listen(PORT, _ => console.log(`Now listening on PORT ${PORT}`));
//http://api.gbif.org/v1/species/search?isExtinct=true
