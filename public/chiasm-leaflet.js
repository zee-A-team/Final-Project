'use strict';
const ChiasmComponent = require('chiasm-component');
const d3 = require('d3');
const L = require('leaflet');

const ChiasmLeaflet = () => {

  let my = ChiasmComponent({
    center: [0, 0],
    zoom: 5
  });
  my.el = document.createElement("div");
  d3.select(my.el).style("background-color", "black");
  my.map = L.map(my.el, {
    zoom: 5,
    minZoom: 2,
    maxZoom: 5,
    // scrollWheelZoom: false,
    center: [40.7127837, -74.0059413],
    zoomControl: true,
    attributionControl: false,
  }).setView(my.center, my.zoom);

  L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
        noWrap: true,
        continuousWorld : true,
        reuseTiles : true
    }).addTo(my.map);

  let overlays = {
      "wat": {},
    };

  L.control.layers({},overlays).addTo(my.map);

  const getCenter = () => {
    var center = my.map.getCenter();
    return [center.lng, center.lat];
  };

  const onMove = () => {
    my.center = getCenter();
    my.zoom = my.map.getZoom();

    const bounds = my.map.getBounds();
    my.longitudeInterval = [bounds.getWest(), bounds.getEast()];
    my.latitudeInterval = [bounds.getSouth(), bounds.getNorth()];
  };
  my.map.on("move", onMove);

  const setCenter = (center) => {
    my.map.off("move", onMove);
    my.map.panTo(L.latLng(center[1], center[0]), {
      animate: false
    });
    my.map.on("move", onMove);
  };

  const rect = d3.select('.extent');

  my.when(["center", "zoom"], function (center, zoom){
    if(!equal(center, getCenter())) setCenter(center);
    my.map.setZoom(zoom);
  });

  const equal = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  my.when("box", (box) => {
    d3.select(my.el)
      .style("width", box.width + "px")
      .style("height", box.height + "px");
    my.map.invalidateSize();
  });
  return my;
};
module.exports = ChiasmLeaflet;
