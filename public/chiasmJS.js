var Chiasm = require('chiasm');
var ChiasmComponent = require('chiasm-component');
var ChiasmCrossfilter = require('./chiasm-crossfilter');
var ChiasmLayout = require('chiasm-layout');
var ChiasmLinks = require('chiasm-links');
var ChiasmDatasetLoader = require('chiasm-dataset-loader');
var BarChart = require('./barChart');
var BubbleMap = require('./bubble-map');

// Create a new Chiasm instance.
var chiasm = new Chiasm();
// Register plugins that the configuration can access.
chiasm.plugins.layout = ChiasmLayout;
chiasm.plugins.links = ChiasmLinks;
chiasm.plugins.datasetLoader = ChiasmDatasetLoader;
chiasm.plugins.barChart = BarChart;
chiasm.plugins.bubbleMap = BubbleMap;
chiasm.plugins.crossfilter = ChiasmCrossfilter;

// Set the Chaism configuration.
chiasm.setConfig({
  "layout": {
    "plugin": "layout",
    "state": {
      "containerSelector": "#chiasm-container",
      "layout": {
        "orientation": "vertical",
        "children": [
          "map",
          "date-chart"
        ]
      },
      "sizes": {
        "date-chart": {
          "size": 0.3
        }
      }
    }
  },
  "map": {
    "plugin": "bubbleMap",
    "state": {
      "center": [5, 50],
      "zoom": 4,
      "rMax": 30
    }
  },
  "date-chart": {
    "plugin": "barChart",
    "state": {
      "fill": "#FF7F78",
      "yColumn": "value",
      "xColumn": "key",
      "margin": { left: 14, top: 1, right: 14, bottom: 20 }
    }
  },
  "data-loader": {
    "plugin": "datasetLoader",
    "state": {
      "path": "animals"
    }
  },
  "crossfilter": {
    "plugin": "crossfilter",
    "state": {
      "groups": {
        "dates": {
          "dimension": "date",
          "aggregation": "year"
        },
        "locations": {
          "dimension": "latlong",
        },
        "latitudes": {
          "dimension": "latitude",
          "aggregation": "floor 500"
        },
        "longitudes": {
          "dimension": "longitude",
          "aggregation": "floor 500"
        }
      }
    }
  },
  "links": {
    "plugin": "links",
    "state": {
      "bindings": [
        "data-loader.dataset -> crossfilter.dataset",
        "crossfilter.dates -> date-chart.data",
        "crossfilter.locations-elements -> map.data",
        "data-loader.dataset -> map.datasetForScaleDomain",
        "date-chart.brushIntervalX -> crossfilter.dateFilter",
        "map.longitudeInterval -> crossfilter.longitudeFilter",
        "map.latitudeInterval -> crossfilter.latitudeFilter"
      ]
    }
  }
});
