var chart = c3.generate({
  bindto: '.chaism-component-date-chart',
  data: {
    url: "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
    type: "bar",
  }
});

console.log('DETECTING C3-BARCHART');
