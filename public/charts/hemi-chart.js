'use strict';
/*----------  PIE CHART COMPARING EXTINCTIONS BY HEMISPHERE  ----------*/
function hemiAnimalData(path) {
  return new Promise(function(resolve, reject) {
    d3.json(path, (d) => {
      let north = 0;
      let south = 0;
    //COUNT NORTH OR SOUTH
      d.forEach( (element) => {
        let parsed = parseFloat(element.latitude);
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
  return new Promise( (resolve, reject) => {
    d3.json(path, (animalData) => {
      let africa = 0;
      animalData.forEach( (ele) => {
        if (ele.continent === 'Africa') {
          return africa++;
        }
      });
      resolve(africa);
    });
  });
}

window.onload = () => {
  document.getElementById('toggleHemiChart').addEventListener('click', () => {
    hemiAnimalData("../animalData.json")
      .then( (poles) => {
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
      .catch( (err) => {
        return console.log(err);
      });
  });
};

window.onload = () => {
  document.getElementById('toggleAfricaChart').addEventListener('click', () => {
    africaChart("../animalData.json")
      .then( (continent) => {
        let chart = c3.generate({
          bindto: '#chart-viewer',
           data: {
               columns: [
                   ['data', 91.4]
               ],
               type: 'gauge',
               onclick: (d, i) => { console.log("onclick", d, i); },
               onmouseover: (d, i) => { console.log("onmouseover", d, i); },
               onmouseout: (d, i) => { console.log("onmouseout", d, i); }
           },
           gauge: {
              label: {
                  format: (value, ratio) => {
                      return value;
                  },
                  show: false, // to turn off the min/max labels.
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
      .catch( (err) =>{
        return console.log(err);
      });
  });
};