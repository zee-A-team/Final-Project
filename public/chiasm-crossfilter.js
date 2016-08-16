// This function defines a Chiasm component that exposes a Crossfilter instance
// to visualizations via the Chaism configuration.

var play = false;
var cfDimension;

function ChiasmCrossfilter() {

  document.addEventListener('keypress', (e) => {
    if(e.keyCode === 32) {
      play = !play;
    }
  });

  var my = new ChiasmComponent({
    groups: Model.None
  });

  var listeners = [];

  my.when(["dataset", "groups"], function (dataset, groups){
    var data = dataset.data;
    if(groups !== Model.None) {
      var cf = crossfilter(data);
      var updateFunctions = [];

      listeners.forEach(my.cancel);

      listeners = Object.keys(groups).map(function (groupName){
        var group = groups[groupName];
        var dimension = group.dimension;
        cfDimension = cf.dimension(function (d){ return d[dimension]; }); //invalid date error here

        // Generate an aggregate function by parsing the "aggregation" config option.
        var aggregate;
        if(group.aggregation){
          if(group.aggregation === "day"){
            aggregate = d3.time.day;
          } else if(group.aggregation === "week"){
            aggregate = d3.time.week;
          } else if(group.aggregation === "month"){
            aggregate = d3.time.month;
          } else if(group.aggregation === "year") {
            aggregate = d3.time.year;
          } else if(group.aggregation.indexOf("floor") === 0){
            var interval = parseInt(group.aggregation.substr(6));
            aggregate = function(d) {
              return Math.floor(d / interval) * interval;
            };
          }
        } else {
          aggregate = function (d){ return d; };
        }

        var cfGroup = cfDimension.group(aggregate);

        var updateMyGroup = function () {
          // This contains the aggregated values.
          my[groupName] = cfGroup.all();

          // This contains the non-aggregated values
          // with filters from other dimensions applied.
          my[groupName + "-elements"] = cfDimension.top(Infinity);
        };
        updateFunctions.push(updateMyGroup);
        updateMyGroup();
        return my.when(dimension + "Filter", function (extent) {
          if( extent !== Model.None) {
            if(dimension === 'date' && play) {
              move(extent);
            } else {
              t.stop();
              cfDimension.filterRange(extent);
            }
          } else {
            cfDimension.filterAll();
          }
          updateFunctions.forEach(function (updateFunction){
            if(updateFunction !== updateMyGroup){
              updateFunction();
            }
          });
        });
      });
    }
  });
  return my;
}
var t = d3.timer(function(e){});

function move(extent) {
  t.restart((e) => {
    var copyExtent = extent.slice();
    copyExtent[0] = new Date(copyExtent[0]);
    copyExtent[1] = new Date(copyExtent[1]);

    copyExtent[0].setDate(copyExtent[0].getDate() + 1);
    copyExtent[1].setDate(copyExtent[1].getDate() + 1);

    brush.extent(copyExtent);

    var rect = d3.select('.extent');
    rect.attr('x', parseFloat(rect.attr('x')) + 1);
    cfDimension.filterRange(copyExtent);
  });
}

