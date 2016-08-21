/*----------  PIE CHART COMPARING EXTINCTIONS BY HEMISPHERE  ----------*/
function hemiAnimalData(path) {
  return new Promise(function(resolve, reject) {
    d3.json(path, function(d){
      var north = 0;
      var south = 0;
    //COUNT NORTH OR SOUTH
      d.forEach(function(element){
        var parsed = parseFloat(element.latitude);
        if(parsed > 0) {
          return north++;
        }
        south++;
      });
      resolve({north, south});
    });
  });
}

function africaChart(path) {
  return new Promise(function(resolve, reject) {
    d3.json(path, function(animalData) {
      var africa = 0;

      animalData.forEach(function(element){
        if (element.continent === 'Africa') {
          return africa++;
        }
      });
      resolve(africa);
    });
  });
}

window.onload = function() {
  document.getElementById('toggleHemiChart').addEventListener('click', function() {
    hemiAnimalData("../animalData.json")
      .then(function(poles) {
        c3.generate({
           bindto: '#chart-viewer',
           data: {
             columns: [
                 ['Northern Hemisphere', poles.north],
                 ['Southern Hemisphere', poles.south],
             ],
             type : 'pie',
             colors: {
               'Northern Hemisphere': '#C3FF68',
               'Southern Hemisphere': '#4F2958',
             }
           }
         });
      })
      .catch(function(err){
        console.log(err);
      });
  });
};

window.onload = function() {
  document.getElementById('toggleAfricaChart').addEventListener('click', function() {
    africaChart("../animalData.json")
      .then(function(continent) {
        var chart = c3.generate({
          bindto: '#chart-viewer',
           data: {
               columns: [
                   ['data', 91.4]
               ],
               type: 'gauge',
               onclick: function (d, i) { console.log("onclick", d, i); },
               onmouseover: function (d, i) { console.log("onmouseover", d, i); },
               onmouseout: function (d, i) { console.log("onmouseout", d, i); }
           },
           gauge: {
              label: {
                  format: function(value, ratio) {
                      return value;
                  },
                  show: false // to turn off the min/max labels.
              },
          min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
          max: 100, // 100 is default
          units: ' %',
          width: 39 // for adjusting arc thickness
           },
           color: {
               pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
               threshold: {
                  unit: 'value', // percentage is default
                  max: 200, // 100 is default
                   values: [30, 60, 90, 100]
               }
           },
           size: {
               height: 180
           }
       });
      })
      .catch(function(err){
        console.log(err);
      });
  });
};
