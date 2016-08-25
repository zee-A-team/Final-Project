const ChiasmLeaflet = require('./chiasm-leaflet');
const Model = require('model-js');
const L = require('leaflet');
const d3 = require('d3');

function BubbleMap() {
  const latitudeColumn = 'latitude';
  const longitudeColumn = 'longitude';

  const my = ChiasmLeaflet();

  var MyCustomMarker = L.Marker.extend({
      bindPopup: function(htmlContent, options) {
      if (options && options.showOnMouseOver) {
        // call the super method
        L.Marker.prototype.bindPopup.apply(this, [htmlContent, options]);
        // unbind the click event
        this.off("click", this.openPopup, this);
        // bind to mouse over
        this.on("mouseover", function(e) {
          // get the element that the mouse hovered onto
          var target = e.originalEvent.fromElement || e.originalEvent.relatedTarget;
          var parent = this._getParent(target, "leaflet-popup");
          // check to see if the element is a popup, and if it is this marker's popup
          if (parent == this._popup._container)
            return true;
          // show the popup
          this.openPopup();
        }, this);

        // and mouse out
        this.on("mouseout", function(e) {
          // get the element that the mouse hovered onto
          var target = e.originalEvent.toElement || e.originalEvent.relatedTarget;
          // check to see if the element is a popup
          if (this._getParent(target, "leaflet-popup")) {
            L.DomEvent.on(this._popup._container, "mouseout", this._popupMouseOut, this);
            return true;
          }
          // hide the popup
          this.closePopup();
        }, this);
      }
    },
    _popupMouseOut: function(e) {
      // detach the event
      L.DomEvent.off(this._popup, "mouseout", this._popupMouseOut, this);
      // get the element that the mouse hovered onto
      var target = e.toElement || e.relatedTarget;
      // check to see if the element is a popup
      if (this._getParent(target, "leaflet-popup"))
        return true;
      // check to see if the marker was hovered back onto
      if (target == this._icon)
        return true;
      // hide the popup
      this.closePopup();
    },
    _getParent: function(element, className) {
      var parent = element.parentNode;
      while (parent != null) {
        if (parent.className && L.DomUtil.hasClass(parent, className))
          return parent;
        parent = parent.parentNode;
      }
      return false;
    }
  });



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
    ctx.fillStyle = 'rgba(240,60,2, 0.03)';
    ctx.fillRect(50, 100, canvas.width, canvas.height*2);
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
    oldMarkers = data.map((daData) => {
      randomizer(daData);
      const lat = locationRandomizer[locationRandomizer.indexOf(daData)].latitude;
      const lng = locationRandomizer[locationRandomizer.indexOf(daData)].longitude;
      const aniType = locationRandomizer[locationRandomizer.indexOf(daData)].type;
      // console.log(aniType);
      const markerCenter = L.latLng(lat, lng);
      let circleMarker;

      var redArr = ['#e50000', '#990000', '#4c0000', '#ff0000','#FF2400','#6F4242','#8B3626'];
      var blueArr = ['#7f7fff', '#1919ff', '#0000e5', '#000099', '#779999','#668B8B'];
      var yellowArr = ['#ffff00', '#FFA500', '#cccc00', '#FF6103','#999900','#CDAD00', '#8B7500'];
      var sizeNumsArr= [1, 2, 3, 4, 5];

      function getMeRandomSize() {
        let randomIndex = Math.floor(Math.random() * redArr.length);
        let randomNum = redArr[randomIndex];
        return randomNum;
      }
      function getMeRandomColors(randParam) {
        let randomIndex;
        let randomColor;
        if (randParam === 'red') {
          randomIndex = Math.floor(Math.random() * redArr.length);
          randomColor = redArr[randomIndex];
        }else if (randParam === 'blue') {
          randomIndex = Math.floor(Math.random() * blueArr.length);
          randomColor = blueArr[randomIndex];
        }else if (randParam === 'yellow') {
          randomIndex = Math.floor(Math.random() * yellowArr.length);
          randomColor = yellowArr[randomIndex];
        }
        return randomColor;
      }

      function toTitleCase(str){
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
      daData.common_name = toTitleCase(daData.common_name);

      if (aniType === 'land') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('red'),
          weight: 3,
          clickable: true
        });
        circleMarker.bindPopup(daData.common_name);
        circleMarker.setRadius(rData(daData));
        circleMarker.on('mouseover', function(e) {
          //open popup;
          var popup = L.popup({
            closeOnClick : true,
            closeButton: false
          })
           .setLatLng(e.latlng)
           .setContent(daData.common_name+" "+daData.year)
           .openOn(my.map);
        });
        circleMarker.addTo(my.map);
      }
      else if (aniType ==='air') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('yellow'),
          weight: 1,
          clickable: true,
        });
        circleMarker.bindPopup(daData.common_name);
        circleMarker.setRadius(rData(daData));
        circleMarker.on('mouseover', function(e) {
          //open popup;
          var popup = L.popup({
            closeOnClick : true,
            closeButton: false
          })
           .setLatLng(e.latlng)
           .setContent(daData.common_name+" "+daData.year)
           .openOn(my.map);
        });
        circleMarker.addTo(my.map);
      }
      else if (aniType ==='marine') {
        circleMarker = L.circleMarker(markerCenter, {
          color: getMeRandomColors('blue'),
          weight: 2,
          clickable: true,
        });
        let addMe = getMeRandomSize();
        circleMarker.bindPopup(daData.common_name);
        circleMarker.setRadius(rData(daData));

        circleMarker.on('mouseover', function(e) {
          //open popup;
          var popup = L.popup({
            closeOnClick : true,
            closeButton: false
          })
           .setLatLng(e.latlng)
           .setContent(daData.common_name+" "+daData.year)
           .openOn(my.map);
        });
        circleMarker.addTo(my.map);
      }



      // var myLayer = new L.GeoJSON();
      // myLayer.on("featureparse", function (e){
      //   e.layer.setStyle(e.properties.style);
      //   e.layer.on("mouseover", function () { alert("ON!") });
      //   e.layer.on("mouseoff", function () { alert("OFF") });
      //  });
      // myLayer.addGeoJSON(circleMarker);
      // my.map.addLayer(myLayer);


      // circleMarker.bindPopup(daData.common_name);
      // circleMarker.setRadius(r(daData));
      // circleMarker.addTo(my.map);
      return circleMarker;
    });
  }, 100));
  return my;
}
module.exports = BubbleMap;
