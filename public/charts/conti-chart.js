module.exports = (function() {
  function __hemiChart(path) {
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

  function __euChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let euData = {
          eu: 0,
          world: 0,
        };

        animalData.forEach((ele) => {
          if (ele.continent === 'Europe') {
            return euData.eu++;
          }
          return euData.world++;
        });
        resolve(euData);
      });
    });
  }

  function __asiaChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let asiaData = {
          asia: 0,
          world: 0,
        };

        animalData.forEach((ele) => {
          if (ele.continent === 'Asia') {
            return asiaData.asia++;
          }
          return asiaData.world++;
        });
        resolve(asiaData);
      });
    });
  }

  function __africaChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let africaData = {
          africa: 0,
          world: 0,
        };

        animalData.forEach((ele) => {
          if (ele.continent === 'Africa') {
            return africaData.africa++;
          }
          return africaData.world++;
        });
        resolve(africaData);
      });
    });
  }

  function __naChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let naData = {
          na: 0,
          world: 0,
        };

        animalData.forEach((ele) => {
          if (ele.continent === 'North America') {
            return naData.na++;
          }
          return naData.world++;
        });
        resolve(naData);
      });
    });
  }

  function __saChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let saData = {
          sa: 0,
          world: 0,
        };

        animalData.forEach((ele) => {
          if (ele.continent === 'South America') {
            return saData.sa++;
          }
          return saData.world++;
        });
        resolve(saData);
      });
    });
  }

  function __auChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let auData = {
          au: 0,
          world: 0,
        };

        animalData.forEach((ele) => {
          if (ele.continent === 'Australia') {
            return auData.au++;
          }
          return auData.world++;
        });
        resolve(auData);
      });
    });
  }

  function __terrestrialChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let terrestrial = {
          terr: 0,
          rest: 0,
        };

        animalData.forEach((ele) => {
          if (ele.type === 'land') {
            return terrestrial.terr++;
          }
          return terrestrial.rest++;
        });
        resolve(terrestrial);
      });
    });
  }

  function __aquaChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let aquatic = {
          aqua: 0,
          rest: 0,
        };

        animalData.forEach((ele) => {
          if (ele.type === 'sea') {
            return aquatic.aqua++;
          }
          return aquatic.rest++;
        });
        resolve(aquatic);
      });
    });
  }

  function __avianChart(path) {
    return new Promise((resolve) => {
      d3.json(path, (animalData) => {
        let avian = {
          avi: 0,
          rest: 0,
        };

        animalData.forEach((ele) => {
          if (ele.type === 'air') {
            return avian.avi++;
          }
          return avian.rest++;
        });
        resolve(avian);
      });
    });
  }



  return {
    hemiChart: __hemiChart,
    euChart: __euChart,
    asiaChart: __asiaChart,
    africaChart: __africaChart,
    naChart: __naChart,
    saChart: __saChart,
    auChart: __auChart,
    terrestrialChart: __terrestrialChart,
    aquaChart: __aquaChart,
    avianChart: __avianChart,
  };
})();