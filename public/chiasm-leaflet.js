const ChiasmComponent = require('chiasm-component')
const d3 = require('d3')
const L = require('leaflet')

const ChiasmLeaflet = () => {
  const my = ChiasmComponent({
    center: [60, 60],
    zoom: 4
  })
  my.el = document.createElement('div')
  d3.select(my.el).style('background-color', 'rgb(36,36,38)')
  my.map = L.map(my.el, {
    zoom: 4,
    inertia: true,
    inertiaMaxSpeed: 1500,
    inertiaThreshold: 32,
    // scrollWheelZoom: false,
    minZoom: 2,
    maxZoom: 6,
    center: [40.7127837, -74.0059413],
    zoomControl: true,
    attributionControl: false
  }).setView(my.center, my.zoom)

  const southWest = L.latLng(-90, -170)
  const northEast = L.latLng(70, 160)
  const bounds = L.latLngBounds(southWest, northEast)

  L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
    continuousWorld: false,
    bounds,
    noWrap: true,
    reuseTiles: true
  }).addTo(my.map)

  const getCenter = () => {
    const center = my.map.getCenter()
    return [center.lng, center.lat]
  }

  const onMove = () => {
    my.center = getCenter()
    my.zoom = my.map.getZoom()

    const bound = my.map.getBounds()
    my.longitudeInterval = [bound.getWest(), bound.getEast()]
    my.latitudeInterval = [bound.getSouth(), bound.getNorth()]
  }
  my.map.on('move', onMove)

  const setCenter = (center) => {
    my.map.off('move', onMove)
    my.map.panTo(L.latLng(center[1], center[0]), {
      animate: false
    })
    my.map.on('move', onMove)
  }

  function contiCenterZoom (toggles, center, zoom) {
    document.getElementById(toggles).addEventListener('click', () => {
      setCenter(center)
      my.map.setZoom(zoom)
      onMove()
    })
  }

  contiCenterZoom('toggleHemiChart', [0, 0], 0)
  contiCenterZoom('toggleEuChart', [10, 55], 4)
  contiCenterZoom('toggleAsiaChart', [90, 30], 4)
  contiCenterZoom('toggleAfricaChart', [9, 10], 4)
  contiCenterZoom('toggleNaChart', [-90, 40], 4)
  contiCenterZoom('toggleSaChart', [-70, -20], 4)
  contiCenterZoom('toggleAuChart', [130, -30], 4)

  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  my.when(['center', 'zoom'], (center, zoom) => {
    if (!equal(center, getCenter())) setCenter(center)
    my.map.setZoom(zoom)
  })

  my.when('box', (box) => {
    d3.select(my.el)
      .style('width', `${box.width}px`)
      .style('height', `${box.height}px`)
    my.map.invalidateSize()
  })
  return my
}
module.exports = ChiasmLeaflet
