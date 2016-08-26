const d3 = require('d3');
const c3 = require('c3');
const charts = require('./conti-chart');

document.getElementById('toggleHemiChart').addEventListener('click', () => {
  charts.hemiChart('../animalData.json')
    .then((poles) => {
      c3.generate({
        bindto: '#chart-viewer1',
        data: {
          columns: [
              ['Northern Hemisphere', poles.north],
              ['Southern Hemisphere', poles.south],
          ],
          type: 'pie',
          colors: {
            'Northern Hemisphere': '#F03C02',
            'Southern Hemisphere': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleEuChart').addEventListener('click', () => {
  charts.euChart('../animalData.json')
    .then((eu) => {
      c3.generate({
        bindto: '#chart-viewer1',
        data: {
          columns: [
              ['Europe', eu.eu],
              ['World', eu.world],
          ],
          type: 'pie',
          colors: {
            'Europe': '#F03C02',
            'World': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleAsiaChart').addEventListener('click', () => {
  charts.asiaChart('../animalData.json')
    .then((asia) => {
      c3.generate({
        bindto: '#chart-viewer1',
        data: {
          columns: [
              ['Asia', asia.asia],
              ['World', asia.world],
          ],
          type: 'pie',
          colors: {
            'Asia': '#F03C02',
            'World': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleAfricaChart').addEventListener('click', () => {
  charts.africaChart('../animalData.json')
    .then((africa) => {
      c3.generate({
        bindto: '#chart-viewer1',
        data: {
          columns: [
              ['Africa', africa.africa],
              ['World', africa.world],
          ],
          type: 'pie',
          colors: {
            'Africa': '#F03C02',
            'World': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleNaChart').addEventListener('click', () => {
  charts.naChart('../animalData.json')
    .then((na) => {
      c3.generate({
        bindto: '#chart-viewer1',
        data: {
          columns: [
              ['North America', na.na],
              ['World', na.world],
          ],
          type: 'pie',
          colors: {
            'North America': '#F03C02',
            'World': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleSaChart').addEventListener('click', () => {
  charts.saChart('../animalData.json')
    .then((sa) => {
      c3.generate({
        bindto: '#chart-viewer1',
        data: {
          columns: [
              ['South America', sa.sa],
              ['World', sa.world],
          ],
          type: 'pie',
          colors: {
            'South America': '#F03C02',
            'World': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleAuChart').addEventListener('click', () => {
  charts.auChart('../animalData.json')
    .then((au) => {
      c3.generate({
        bindto: '#chart-1',
        data: {
          columns: [
              ['Australia', au.au],
              ['World', au.world],
          ],
          type: 'pie',
          colors: {
            'Australia': '#F03C02',
            'World': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleTerrChart').addEventListener('click', () => {
  charts.terrestrialChart('../animalData.json')
    .then((terr) => {
      c3.generate({
        bindto: '#chart-viewer2',
        data: {
          columns: [
              ['Terrestrial', terr.terr],
              ['Rest', terr.rest],
          ],
          type: 'pie',
          colors: {
            'Terrestrial': '#F03C02',
            'Rest': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleAquaChart').addEventListener('click', () => {
  charts.aquaChart('../animalData.json')
    .then((aqua) => {
      c3.generate({
        bindto: '#chart-viewer2',
        data: {
          columns: [
              ['Aquatic', aqua.aqua],
              ['Rest', aqua.rest],
          ],
          type: 'pie',
          colors: {
            'Aquatic': '#F03C02',
            'Rest': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});

document.getElementById('toggleAvianChart').addEventListener('click', () => {
  charts.avianChart('../animalData.json')
    .then((avian) => {
      c3.generate({
        bindto: '#chart-viewer2',
        data: {
          columns: [
              ['Avian', avian.avi],
              ['Rest', avian.rest],
          ],
          type: 'pie',
          colors: {
            'Avian': '#F03C02',
            'Rest': '#C21A01',
          },
          size: {
            width: 640
          },
        },
      });
    })
    .catch((err) => console.log(err));
});
