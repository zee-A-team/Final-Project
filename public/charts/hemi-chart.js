const d3 = require('d3');
const c3 = require('c3');

function hemiAnimalData(path) {
  return new Promise((resolve) => {
    d3.json(path, (d) => {
      let north = 0;
      let south = 0;
      d.forEach((element) => {
        const parsed = parseFloat(element.latitude);
        if (parsed > 0) {
          return north++;
        }
        return south++;
      });
      resolve({ north, south });
    });
  });
}

function africaChart(path) {
  return new Promise((resolve) => {
    d3.json(path, (animalData) => {
      let africa = 0;
      animalData.forEach((ele) => {
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
    hemiAnimalData('../animalData.json')
      .then((poles) => {
        c3.generate({
          bindto: '#chart-viewer',
          data: {
            columns: [
                ['Northern Hemisphere', poles.north],
                ['Southern Hemisphere', poles.south],
            ],
            type: 'pie',
            colors: {
              'Northern Hemisphere': '#C3FF68',
              'Southern Hemisphere': '#4F2958',
            },
          },
        });
      })
      .catch((err) => console.log(err));
  });
};

window.onload = () => {
  document.getElementById('toggleAfricaChart').addEventListener('click', () => {
    africaChart('../animalData.json')
      .then((continent) => {
        let chart = c3.generate({
          bindto: '#chart-viewer',
          data: {
            columns: [
                  ['data', 91.4],
            ],
            type: 'gauge',
            onclick: (d, i) => console.log('onclick', d, i),
            onmouseover: (d, i) => console.log('onmouseover', d, i),
            onmouseout: (d, i) => console.log('onmouseout', d, i),
          },
          gauge: {
            label: {
              format: (value) => value,
              show: false,
            },
            min: 0,
            max: 100,
            units: ' %',
            width: 39,
          },
          color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
            threshold: {
              unit: 'value',
              max: 200,
              values: [30, 60, 90, 100],
            },
          },
          size: {
            height: 180,
          },
        });
      })
      .catch((err) => console.log(err));
  });
};
