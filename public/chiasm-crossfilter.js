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
      // const w = data.map((e) => {
      //   const obj = Object.assign(e);
      //   obj.date = Date.now(new Date(obj.date));
      //   return obj;
      // });
      var cf = crossfilter(data);
      var updateFunctions = [];

      listeners.forEach(my.cancel);

      listeners = Object.keys(groups).map(function (groupName){
        var group = groups[groupName];
        var dimension = group.dimension;
        var cfDimension = cf.dimension(function (d){
          return d[dimension];
        });
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
          if(extent !== Model.None) {
            move(extent, cfDimension);
            if(eL === false) {
              eL = true;

              document.body.addEventListener('keydown', (e) => {
                if(e.keyCode === 32) {
                  play = !play;
                }
              });
            }
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

var t = d3.timer(function (e) {});

function move(extent, dr) {
  if(play) {
    t.restart((e) => {
      if(typeof extent[0] === 'object') {
        var brush0 = new Date(brush.extent()[0].setDate(extent[0].getDate() + 1));
        var brush1 = new Date(brush.extent()[1].setDate(extent[1].getDate() + 1));
        // brushExtent = [brush0, brush1];

        // var rect = d3.select('.extent');
        // rect.attr('x', parseFloat(rect.attr('x')) + 1);

        dr.filterRange(brush.extent());
      } else {
        dr.filterRange(brush.extent());
        t.stop();
      }
    });
  }
  else {
    t.stop();
  }
}