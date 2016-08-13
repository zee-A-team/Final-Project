// This function defines a Chiasm component that exposes a Crossfilter instance
// to visualizations via the Chaism configuration.
var play = true;
var eL = false;


function ChiasmCrossfilter() {
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
        var cfDimension = cf.dimension(function (d){ return d[dimension]; }); //invalid date error here

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
          if(extent !== Model.None){
            move(extent, cfDimension);
            if(!eL) {
              document.body.addEventListener('keydown', (e) => {
                if(e.keyCode === 32) {
                  play = !play;
                }
              });
            }
                        // cfDimension.filterRange(extent);
          }
          else {
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

var t = d3.interval(function (e) {}, 5000);

function move(extent, dr) {
  if(play) {
    t.restart((e) => {
      if(typeof extent[0] === 'object') {
        var d = new Date(extent[0]).getYear();
        var d2 = new Date(extent[1]).getYear();
        extent[0].setFullYear((d + 1970) + 1);
        extent[1].setFullYear((d2 + 1970) + 1);

        var rect = d3.select('.extent');
        rect.attr('x', Number(rect.attr('x')) + 1);
        console.log(rect.attr('x') + 1);

        dr.filterRange(extent);
      } else {
        dr.filterRange(extent);
      }
    }, 500);
  }
  else {
    t.stop();
    dr.filterRange(extent);
  }
}