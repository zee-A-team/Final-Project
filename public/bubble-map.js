const ChiasmLeaflet = require('./chiasm-leaflet');
const Model = require('model-js');
const L = require('leaflet');
const d3 = require('d3');

function BubbleMap() {
  const latitudeColumn = 'latitude';
  const longitudeColumn = 'longitude';

  const my = ChiasmLeaflet();



  my.when('data', (data) => {
    my.cleanData = data.filter((d) => {
      const lat = d[latitudeColumn];
      const lng = d[longitudeColumn];
      if (isNaN(+lat) || isNaN(+lng)) {
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
  canvasTiles.drawTile = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0, 0.00)';
    ctx.fillRect(50, 100, canvas.width, (canvas.height * 2));
  };
  canvasTiles.addTo(my.map);
  canvasTiles.bringToBack();
  my.when(['datasetForScaleDomain', 'rColumn', 'rDefault', 'rMin', 'rMax'],
      (dataset, rColumn, rDefault, rMin, rMax) => {
        const data = dataset.data;
        if (rColumn === Model.None) {
          my.r = () => rDefault;
        } else {
          rScale
            .domain(d3.extent(data, (d) => d[rColumn]))
            .range([rMin, rMax]);
          my.r = (d) => rScale(d[rColumn]);
        }
      });

  let oldMarkers = [];
  const locationRandomizer = [];
  const randomizer = (object) => {
    const tempObj = object;
    if (!locationRandomizer.includes(tempObj)) {
      tempObj.latitude -= (Math.random() * (0.00 + 0.0100) + 0.0000).toFixed(4);
      tempObj.longitude -= (Math.random() * (0.20 - 0.0200) + 0.0200).toFixed(4);
      locationRandomizer.push(tempObj);
    }
  };

  my.when(['cleanData', 'r'], _.throttle((data, rData) => {
    oldMarkers.forEach((marker) => {
      my.map.removeLayer(marker);
    });
    oldMarkers = data.map((dx) => {
      randomizer(dx);
      const lat = locationRandomizer[locationRandomizer.indexOf(dx)].latitude;
      const lng = locationRandomizer[locationRandomizer.indexOf(dx)].longitude;
      const aniType = locationRandomizer[locationRandomizer.indexOf(dx)].type;
      const markerCenter = L.latLng(lat, lng);
      let circleMarker;

      const orangeArr = [
        // '#ff894a',
        // '#ff7830',
        // '#ff6817'
        '#e34f00',
        '#c94600',
        '#b03d00',
        '#FF6103',
        '#fc5800'
      ];

      const redArr = [
        // '#330000',
        // '#4c0000',
        // '#660000',
        // '#7f0000',
        // '#990000',
        // '#b20000',
        '#cc0000',
        '#e50000',
        '#ff0000'
      ];

      const blueArr = [
        // '#474369',
        // '#514d79',
        // '#5c5788',
        '#666198',
        '#746fa3',
        '#837fad',
        '#928eb7'
      ];

      const yellowArr = [
        '#ffff00',
        '#FFA500',
        '#cccc00',
        '#999900',
        // '#CDAD00',
        // '#8B7500'
      ];

      const greenArr = [
        // '#436947',
        // '#4d7951',
        // '#57885c',
        '#619866',
        '#6fa374',
        '#7fad83',
        '#8eb792'
      ];

      const liteGreenArr = [
        'green'
      ];

      const purpleArr = [
        'purple'
      ];

  function geometryHover(username, map, layer, options) {

  options = options || {}
  var HIGHLIGHT_STYLE = {
    weight: 3,
    color: '#FFFFFF',
    opacity: 1,
    fillColor: '#FFFFFF',
    fillOpacity: 0.3
  };
  style = options.style || HIGHLIGHT_STYLE;
  var polygonsHighlighted = [];


  // fetch the geometry
  var sql = new cartodb.SQL({ user: username, format: 'geojson' });
  sql.execute("select cartodb_id, ST_Simplify(the_geom, 0.1) as the_geom from (" + layer.getSQL() + ") as _wrap").done(function(geojson) {
    var features = geojson.features;
    for(var i = 0; i < features.length; ++i) {
      var f = geojson.features[i];
      var key = f.properties.cartodb_id

      // generate geometry
      var geo = L.GeoJSON.geometryToLayer(features[i].geometry);
      geo.setStyle(style);

      // add to polygons
      polygons[key] = polygons[key] ||  [];
      polygons[key].push(geo);
    }
  });

  function featureOver(e, pos, latlng, data) {
    featureOut();
    var pol = polygons[data.cartodb_id] || [];
    for(var i = 0; i < pol.length; ++i) {
      map.addLayer(pol[i]);
      polygonsHighlighted.push(pol[i]);
    }
  }

  function featureOut() {
    var pol = polygonsHighlighted;
    for(var i = 0; i < pol.length; ++i) {
      map.removeLayer(pol[i]);
    }
    polygonsHighlighted = [];
  }

  layer.on('featureOver', featureOver);
  layer.on('featureOut', featureOut);
  layer.setInteraction(true);

}

      function getMeRandomColors(randParam) {
        let randomColor;
        if (randParam === 'orange') {
          randomColor = orangeArr[Math.floor(Math.random() * orangeArr.length)];
        } else if (randParam === 'blue') {
          randomColor = blueArr[Math.floor(Math.random() * blueArr.length)];
        } else if (randParam === 'yellow') {
          randomColor = yellowArr[Math.floor(Math.random() * yellowArr.length)];
        } else if (randParam === 'purple') {
          randomColor = purpleArr[Math.floor(Math.random() * purpleArr.length)];
        } else if (randParam === 'green') {
          randomColor = greenArr[Math.floor(Math.random() * greenArr.length)];
        } else if (randParam === 'lightgreen') {
          randomColor = liteGreenArr[Math.floor(Math.random() * liteGreenArr.length)];
        } else if (randParam === 'red') {
          randomColor = redArr[Math.floor(Math.random() * redArr.length)];
        }
        return randomColor;
      }

      var getRandomNumber = function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      function toTitleCase(str){
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      }
      dx.common_name = toTitleCase(dx.common_name);

      if (aniType === 'land') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('red'),
          weight: 3,
          clickable: true,
        });
        circleMarker.setRadius(getRandomNumber(5, 6));
      }
      else if (aniType === 'air') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('yellow'),
          weight: 1,
          clickable: true,
        });
        circleMarker.setRadius(2);
      }
      else if (aniType === 'marine') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('blue'),
          weight: 2,
          clickable: true,
        });
        circleMarker.setRadius(3);
      }
      else if (aniType === 'mars') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('orange'),
          weight: 2,
          clickable: true,
        });
        circleMarker.setRadius(getRandomNumber(6, 7));
      }
      else if (aniType === 'reptile') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('green'),
          weight: 2,
          clickable: true,
        });
        circleMarker.setRadius(getRandomNumber(6, 7));
      }
      else if (aniType === 'amph') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('lightgreen'),
          weight: 2,
          clickable: true,
        });
        circleMarker.setRadius(getRandomNumber(2, 3));
      }
      else {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('blue'),
          weight: 2,
          clickable: true,
        });
        circleMarker.setRadius(rData(dx));
      }
      circleMarker.bindPopup(dx.common_name);
        circleMarker.setRadius(rData(dx));
      circleMarker.on('mouseover', function(e) {
        const popup = L.popup()
         .setLatLng(e.latlng)
         .setContent(`${dx.common_name} (${dx.year})`)
         .openOn(my.map);
      });

      if (dx.scientific_name === 'Raphus cucullatus') {
        circleMarker.setRadius(17);
        circleMarker.on('mouseover', function(e) {
          const popup = L.popup({
            color: getMeRandomColors('yellow'),
            weight: 1,
            clickable: true,
            offset: new L.Point(180, 100),
            maxWidth: 270
          })
           .setLatLng(e.latlng)
           .setContent(`${dx.common_name} (${dx.year}) <br>
            <img src="./img/dodo_wild.jpg" height="190px" width="260px"> <p> ${dx.description}
            <a href="https://en.wikipedia.org/wiki/Dodo" target="_blank">\>\>Wiki Link</a></p>` )
           .openOn(my.map);
        });
      }

      if (dx.scientific_name === 'Rhodacanthis palmeri') {
        circleMarker.setRadius(14);
        circleMarker.on('mouseover', function(e) {
          const popup = L.popup({
            offset: new L.Point(200, 230)
          })
           .setLatLng(e.latlng)
           .setContent(`${dx.common_name} (${dx.year}) <br>
            <div style="width: 290px; height: 200px; overflow: hidden;">
            <img src="./img/gkoafinch.jpg" width="290px"> </div> <p>${dx.description}
            <a href="https://en.wikipedia.org/wiki/Greater_koa_finch" target="_blank">\>\>Wiki Link</a></p>` )
           .openOn(my.map);
        });
      }

      if (dx.scientific_name === 'Mammuthus primigenius') {
        circleMarker.setRadius(21);
        circleMarker.on('mouseover', function(e) {
          const popup = L.popup({
            offset: new L.Point(200, 330)
          })
           .setLatLng(e.latlng)
           .setContent(`${dx.common_name} (${dx.year}) <br>
            <img src="./img/mammoth.jpg" width="290px"> <p> ${dx.description} <a href="https://en.wikipedia.org/wiki/Mammoth" target="_blank">\>\>Wiki Link</a></p>` )
           .openOn(my.map);
        });
      }
      circleMarker.addTo(my.map);

      return circleMarker;
    });
  }, 100));
  return my;
}
module.exports = BubbleMap;
