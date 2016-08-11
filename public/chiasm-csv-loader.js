function ChiasmCSVLoader (){

  var my = ChiasmComponent({
    path: Model.None
  });

  var parseFunctions = {
    number: parseFloat
  };

  function generateColumnParsers(metadata) {
    if("columns" in metadata){
      return metadata.columns
        .filter(function (column){
          return column.type !== "string";
        })
        .map(function (column){
          var parse = parseFunctions[column.type];
          var name = column.name;
          return function (d){
            d[name] = parse(d[name]);
          };
        });
    } else {
      return [];
    }
  }

  my.when("path", function (path){
    if(path !== Model.None){

      d3.json(path + ".json", function(error, metadata) {
        var columnParsers = generateColumnParsers(metadata);
        var numColumns = columnParsers.length;

        function type (d){
          // Old school for loop as an optimization.
          for(var i = 0; i < numColumns; i++){

            // Each column parser function mutates the row object,
            // replacing the column property string with its parsed variant.
            columnParsers[i](d);
          }
          return d;
        }

        d3.csv(path + ".csv", type, function(error, data) {
          my.data = data;
        });
      });
    }
  });

  return my;
}