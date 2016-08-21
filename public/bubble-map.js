// This is a Chiasm component that implements a bubble map.
// Based on chiasm-leaflet.
//
var ChiasmLeaflet = require('./chiasm-leaflet');
var Model = require('model-js');
var L = require('leaflet');

function BubbleMap() {

  // TODO move these to config.
  var latitudeColumn = "latitude";
  var longitudeColumn = "longitude";

  // Extend chiasm-leaflet using composition (not inheritence).
  var my = ChiasmLeaflet();
  // my.map is the Leaflet instance.

  my.when("data", function (data){
    my.cleanData = data.filter(function (d) {
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

    // This is the data column that maps to bubble size.
    // "r" stands for radius.
    rColumn: Model.None,

    // The circle radius used if rColumn is not specified.
    rDefault: 3,

    // The range of the radius scale if rColumn is specified.
    rMin: 0,
    rMax: 10,
  });
  var rScale = d3.scale.sqrt();


  // Add a semi-transparent white layer to fade the
  // black & white base map to the background.
  var canvasTiles = L.tileLayer.canvas();
  canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
    var ctx = canvas.getContext('2d');
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

      // This line added to demonstrate working example
      // my.r = function (){ return rDefault; };
    }
  });

  var oldMarkers = [];
  var locationRandomizer = [];
  var randomizer = function(object){
    if(!locationRandomizer.includes(object)){
      object.latitude = object.latitude + Math.random(0,500);
      object.longitude = object.longitude + Math.random(0,500);
      locationRandomizer.push(object);
    }
  };
  my.when(["cleanData", "r"], _.throttle(function (data, r) {
    oldMarkers.forEach(function (marker){
      my.map.removeLayer(marker);
    });

    oldMarkers = data.map(function (d){
      randomizer(d);

      var lat = locationRandomizer[locationRandomizer.indexOf(d)].latitude;
      var lng = locationRandomizer[locationRandomizer.indexOf(d)].longitude;

      var markerCenter = L.latLng(lat, lng);
      var circleMarker = L.circleMarker(markerCenter, {
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
