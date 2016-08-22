const c3 = require('c3');
const d3 = require('d3');

let data = d3.json('../animalData.json', (data) => {
  let north = 0;
  let south = 0;

  data.forEach((element) => {
    const parsed = parseFloat(element.latitude);
    if (parsed > 0) return north++;
    return south++;
  });

  const chart = c3.generate({
    bindto: '#left-additional-info',
    data: {
      columns: [
        ['Northern Hemisphere', north],
        ['Southern Hemisphere', south],
      ],
      type: 'pie',
      colors: {
        'Northern Hemisphere': '#C3FF68',
        'Southern Hemisphere': '#4F2958',
      },
    },
  });
});

