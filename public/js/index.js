
angular.module('d3', [])
  .factory('d3Service', [function(){
    var d3;
    // insert d3 code here

  var width = 960,
      height = 960;

  var projection = d3.geo.mercator()
    .scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var graticule = d3.geo.graticule();

  var curYear;

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  var yearLabel = svg.append("text")
    .attr("class", "year-label")
    .attr("x", "420px")
    .attr("y", "900px")
    .text(curYear);

  d3.json("./js/world-50m.json", function(error, world) {
    if (error) throw error;

    svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

    // d3.json("extinctdata.json", function(error, animals){ //json data goes here
    //   if (error) throw error;
    //   var coordinates = animals.location
  //       .filter(function(feature){
  //       return feature.geometry !== null;
  //       });

    // });

  });

  d3.select(self.frameElement).style("height", height + "px");

  return d3;
}];
