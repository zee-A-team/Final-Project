/*----------  PIE CHART COMPARING EXTINCTIONS BY HEMISPHERE  ----------*/
var c3 = require('c3');
var data = d3.json("../animalData.json", function(data){
 var north = 0;
 var south = 0;


//COUNT NORTH OR SOUTH
  data.forEach(function(element){
   var parsed = parseFloat(element.latitude);
    if(parsed > 0) {
      return north++;
    }
    south++;
  });

//GENEREATE PIE CHART
  var chart = c3.generate({
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

