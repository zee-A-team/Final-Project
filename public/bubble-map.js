'use strict';
const ChiasmLeaflet = require('./chiasm-leaflet');
const Model = require('model-js');
const L = require('leaflet');

function BubbleMap() {
  const latitudeColumn = "latitude";
  const longitudeColumn = "longitude";

  let my = ChiasmLeaflet();

  my.when("data", (data) => {
    my.cleanData = data.filter( (d) => {
      var lat = d[latitudeColumn];
      var lng = d[longitudeColumn];
      if(isNaN(+lat) || isNaN(+lng)){
        console.log(`lat:${lat} + lng:${lng} Invalid.`);
        return false;
      }
      return true;
    });
  });
  my.addPublicProperties({
    rColumn: Model.None,
    rDefault: 3,
    rMin: 0,
    rMax: 10,
  });
  const rScale = d3.scale.sqrt();

  const canvasTiles = L.tileLayer.canvas();
  canvasTiles.drawTile = (canvas, tilePoint, zoom) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(255, 255, 250, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  canvasTiles.addTo(my.map);

  // Generate a function or constant for circle radius,
  // depending on whether or not rColumn is defined.

  my.when(["datasetForScaleDomain", "rColumn", "rDefault", "rMin", "rMax"],
      function (dataset, rColumn, rDefault, rMin, rMax){

    var data = dataset.data;

    if(rColumn === Model.None){
      my.r = function (){ return rDefault; };
    } else {
      rScale
        .domain(d3.extent(data, function (d){ return d[rColumn]; }))
        .range([rMin, rMax]);
      my.r = function (d){ return rScale(d[rColumn]); };
    }
  });

  var oldMarkers = [];
  let locationRandomizer = [];
  let randomizer = (object) => {
    if(!locationRandomizer.includes(object)){
      object.latitude = object.latitude + Math.random(0,500);
      object.longitude = object.longitude + Math.random(0,500);
      locationRandomizer.push(object);
    }
  };
  my.when(["cleanData", "r"], _.throttle( (data, r) => {
    oldMarkers.forEach( (marker) => {
      my.map.removeLayer(marker);
    });
    oldMarkers = data.map( (d) => {
      randomizer(d);
      const lat = locationRandomizer[locationRandomizer.indexOf(d)].latitude;
      const lng = locationRandomizer[locationRandomizer.indexOf(d)].longitude;
      const markerCenter = L.latLng(lat, lng);
      const circleMarker = L.circleMarker(markerCenter, {
        color: "#FF4136",
        weight: 1,
        clickable: true,
      });
      circleMarker.commonName = d['Common name'];
      circleMarker.bindPopup(circleMarker.commonName);
      circleMarker.setRadius(r(d));
      circleMarker.addTo(my.map);
      return circleMarker;
    });
  }, 100));
  return my;
}
module.exports = BubbleMap;
