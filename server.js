'use strict';
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(PORT, _ => console.log(`Now listening on PORT ${PORT}`));
//http://api.gbif.org/v1/species/search?isExtinct=true
