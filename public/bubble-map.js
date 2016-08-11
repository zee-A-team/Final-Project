// This is a Chiasm component that implements a bubble map.
// Based on chiasm-leaflet.
//

function BubbleMap() {

  // TODO move these to config.
  var latitudeColumn = "lat";
  var longitudeColumn = "lng";


  // Extend chiasm-leaflet using composition (not inheritence).
  var my = ChiasmLeaflet();
  // my.map is the Leaflet instance.

  my.when("data", function (data){
    my.cleanData = data.filter(function (d) {
      var lat = d[latitudeColumn];
      var lng = d[longitudeColumn];
      if(isNaN(+lat) || isNaN(+lng)){
        console.log("Bad data - lat = " + lat + " lng = " + lng);
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
  var rScale = d3.scale.sqrt();

  my.when(["datasetForScaleDomain", "rColumn", "rDefault", "rMin", "rMax"],
      function (dataset, rColumn, rDefault, rMin, rMax){
    var data = dataset.data;

    if(rColumn === Model.None){
      my.r = function (){ return rDefault; };
    } else {
      // rScale
      //   .domain(d3.extent(data, function (d){ return d[rColumn]; }))
      //   .range([rMin, rMax]);
      // my.r = function (d){ return rScale(d[rColumn]); };
      my.r = function (){ return rDefault; };
    }
  });

  var oldMarkers = [];
  my.when(["cleanData", "r"], _.throttle(function (data, r){

    // TODO make this more efficient.
    // Use D3 data joins?

    // oldMarkers.forEach(function (marker){
    //   my.map.removeLayer(marker);
    // });

    oldMarkers = data.map(function (d){

      var lat = d[latitudeColumn];
      var lng = d[longitudeColumn];
      var markerCenter = L.latLng(lat, lng);
      var circleMarker = L.circleMarker(markerCenter, {

        // TODO move this to config.
        color: "#FF4136",
        weight: 1,
        clickable: true,
      });

      //
      // icon
      // var circleMarker = L.icon({

      //   // TODO move this to config.
      //   iconUrl: 'lion_small-compressor.png',
      //   iconSize: [30,30],
      //   clickable: true,
      // });

      // circleMarker.bindPopup("I am a fucking circle");
      // L.marker(markerCenter,{icon:circleMarker}).addTo(my.map);
      circleMarker.setRadius(10);

      circleMarker.addTo(my.map);

      return circleMarker;
    });
  }, 100));

  return my;
}
