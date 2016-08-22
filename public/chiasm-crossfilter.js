const ChiasmComponent = require('chiasm-component');
const Model = require('model-js');
const crossfilter = require('crossfilter');
const d3 = require('d3');

function ChiasmCrossfilter() {
  const my = new ChiasmComponent({
    groups: Model.None,
  });

  let listeners = [];

  my.when(['dataset', 'groups'], (dataset, groups) => {
    const data = dataset.data;
    if (groups !== Model.None) {
      const cf = crossfilter(data);
      const updateFunctions = [];
      listeners.forEach(my.cancel);
      listeners = Object.keys(groups).map((groupName) => {
        const group = groups[groupName];
        const dimension = group.dimension;
        const cfDimension = cf.dimension((d) => d[dimension]);
        let aggregate;
        if (group.aggregation) {
          if (group.aggregation === 'day') {
            aggregate = d3.time.day;
          } else if (group.aggregation === 'week') {
            aggregate = d3.time.week;
          } else if (group.aggregation === 'month') {
            aggregate = d3.time.month;
          } else if (group.aggregation === 'year') {
            aggregate = d3.time.year;
          } else if (group.aggregation.indexOf('floor') === 0) {
            const interval = parseInt(group.aggregation.substr(6));
            aggregate = (d) => Math.floor(d / interval) * interval;
          }
        } else {
          aggregate = (d) => d;
        }

        const cfGroup = cfDimension.group(aggregate);
        const updateMyGroup = () => {
          my[groupName] = cfGroup.all();
          my[`${groupName}-elements`] = cfDimension.top(Infinity);
        };
        updateFunctions.push(updateMyGroup);
        updateMyGroup();
        return my.when(`${dimension}Filter`, (extent) => {
          if (extent !== Model.None) {
            cfDimension.filterRange(extent);
          } else {
            cfDimension.filterAll();
          }
          updateFunctions.forEach((updateFunction) => {
            if (updateFunction !== updateMyGroup) {
              updateFunction();
            }
          });
        });
      });
    }
  });
  return my;
}
module.exports = ChiasmCrossfilter;
