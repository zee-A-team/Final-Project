const panel1 = document.getElementById('panel-1-div');
const panel2 = document.getElementById('panel-2-div');
const panel3 = document.getElementById('control-panel');

const panel1Arr = [
  ['toggleHemiChart', 'Hemisphere'],
  ['toggleEuChart', 'Europe'],
  ['toggleAsiaChart', 'Asia'],
  ['toggleAfricaChart', 'Africa'],
  ['toggleNaChart', 'North America'],
  ['toggleSaChart', 'South America'],
  ['toggleAuChart', 'Australia'],
];

const panel2Arr = [
  ['toggleTerrChart', 'Terrestrial'],
  ['toggleAquaChart', 'Aquatic'],
  ['toggleAvianChart', 'Avian'],
];

const panel3Arr = [
  ['navigate-button', 'Navigate'],
  ['chart-button', 'Charts'],
  ['about-button', 'About'],
];

function createElement(id, value) {
  const element = document.createElement('div');
  element.id = id;
  element.innerHTML = value;
  return element;
}

function panelOne() {
  const h3 = document.createElement('h3');
  h3.innerHTML = 'By Geolocation';
  panel1.appendChild(h3);
  for (let i = 0; i < panel1Arr.length; i++) {
    panel1.appendChild(createElement(panel1Arr[i][0], panel1Arr[i][1]));
  }
}
function panelTwo() {
  const h3 = document.createElement('h3');
  h3.innerHTML = 'By Habitat';
  panel2.appendChild(h3);
  for (let i = 0; i < panel2Arr.length; i++) {
    panel2.appendChild(createElement(panel2Arr[i][0], panel2Arr[i][1]));
  }
}
function panelThree() {
  const h3 = document.createElement('h3');
  h3.innerHTML = 'By Time';
  panel3.appendChild(h3);
  for (let i = 0; i < panel3Arr.length; i++) {
    panel3.appendChild(createElement(panel3Arr[i][0], panel3Arr[i][1]));
  }
}

function switcher(i) {
  switch (i) {
    case 0:
      panelOne();
      break;
    case 1:
      panelTwo();
      break;
    default:
      panelThree();
  }
}

for (let i = 0; i < 3; i++) {
  switcher(i);
}
