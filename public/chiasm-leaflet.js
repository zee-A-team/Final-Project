const ChiasmComponent = require('chiasm-component');
const d3 = require('d3');
const L = require('leaflet');

const ChiasmLeaflet = () => {
  const my = ChiasmComponent({
    center: [0, 0],
    zoom: 5,
  });
  my.el = document.createElement('div');
  d3.select(my.el).style('background-color', 'black');
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
    continuousWorld: true,
    reuseTiles: true,
  }).addTo(my.map);

  const overlays = {
    wat: {},
  };

  L.control.layers({}, overlays).addTo(my.map);

  const getCenter = () => {
    const center = my.map.getCenter();
    return [center.lng, center.lat];
  };

  const onMove = () => {
    my.center = getCenter();
    my.zoom = my.map.getZoom();

    const bounds = my.map.getBounds();
    my.longitudeInterval = [bounds.getWest(), bounds.getEast()];
    my.latitudeInterval = [bounds.getSouth(), bounds.getNorth()];
  };
  my.map.on('move', onMove);

  const setCenter = (center) => {
    my.map.off('move', onMove);
    my.map.panTo(L.latLng(center[1], center[0]), {
      animate: false,
    });
    my.map.on('move', onMove);
  };

  document.getElementById('toggleHemiChart').addEventListener('click', () => {
    setCenter([0, 0]);
    my.map.setZoom(0);
  });

  document.getElementById('toggleEuChart').addEventListener('click', () => {
    setCenter([10, 55]);
    my.map.setZoom(4);
  });

  document.getElementById('toggleAsiaChart').addEventListener('click', () => {
    setCenter([90, 30]);
    my.map.setZoom(4);
  });

  document.getElementById('toggleAfricaChart').addEventListener('click', () => {
    setCenter([9, 10]);
    my.map.setZoom(4);
  });

  document.getElementById('toggleNaChart').addEventListener('click', () => {
    setCenter([-90, 40]);
    my.map.setZoom(4);
  });

  document.getElementById('toggleSaChart').addEventListener('click', () => {
    setCenter([-70, -20]);
    my.map.setZoom(4);
  });

  document.getElementById('toggleAuChart').addEventListener('click', () => {
    setCenter([130, -30]);
    my.map.setZoom(4);
  });

  my.when(['center', 'zoom'], (center, zoom) => {
    if (!equal(center, getCenter())) setCenter(center);
    my.map.setZoom(zoom);
  });

  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  my.when('box', (box) => {
    d3.select(my.el)
      .style('width', `${box.width}px`)
      .style('height', `${box.height}px`);
    my.map.invalidateSize();
  });
  return my;
};
module.exports = ChiasmLeaflet;
