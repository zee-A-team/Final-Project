/*----------  PIE CHART COMPARING EXTINCTIONS BY HEMISPHERE  ----------*/
const c3 = require('c3');
let data = d3.json("../animalData.json", function(data){
  let north = 0;
  let south = 0;

//COUNT NORTH OR SOUTH
  data.forEach(function(element){
   let parsed = parseFloat(element.latitude);
    if(parsed > 0) {
      return north++;
    }
    south++;
  });

//GENEREATE PIE CHART
  let chart = c3.generate({
    bindto: '#left-additional-info',
    data: {
      columns: [
          ['Northern Hemisphere', north],
          ['Southern Hemisphere', south],
      ],
      type : 'pie',
      colors: {
        'Northern Hemisphere': '#C3FF68',
        'Southern Hemisphere': '#4F2958',
      }
    }
  });
});

