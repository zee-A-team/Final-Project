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
      tempObj.latitude += Math.random(0, 500);
      tempObj.longitude += Math.random(0, 500);
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

      const redArr = [
        '#e50000',
        '#990000',
        '#4c0000',
        '#ff0000',
        '#FF2400',
        '#6F4242',
        '#8B3626'
      ];

      const blueArr = [
        '#7f7fff',
        '#1919ff',
        '#0000e5',
        '#000099',
        '#779999',
        '#668B8B'
      ];

      const yellowArr = [
        '#ffff00',
        '#FFA500',
        '#cccc00',
        '#FF6103',
        '#999900',
        '#CDAD00',
        '#8B7500'
      ];

      function getMeRandomColors(randParam) {
        let randomColor;
        if (randParam === 'red') {
          randomColor = redArr[Math.floor(Math.random() * redArr.length)];
        } else if (randParam === 'blue') {
          randomColor = blueArr[Math.floor(Math.random() * blueArr.length)];
        } else if (randParam === 'yellow') {
          randomColor = yellowArr[Math.floor(Math.random() * yellowArr.length)];
        }
        return randomColor;
      }

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


      } else if (aniType === 'air') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('yellow'),
          weight: 1,
          clickable: true,
        });
      }

      else if (aniType === 'marine') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('blue'),
          weight: 2,
          clickable: true,
        });
      } else {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('blue'),
          weight: 2,
          clickable: true,
        });
      }
      circleMarker.bindPopup(dx.common_name);
      circleMarker.setRadius(rData(dx));
      circleMarker.on('mouseover', function(e) {
        const popup = L.popup()
         .setLatLng(e.latlng)
         .setContent(`${dx.common_name} (${dx.year})`)
         .openOn(my.map);
      });
      circleMarker.addTo(my.map);

      return circleMarker;
    });
  }, 100));
  return my;
}
module.exports = BubbleMap;
