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

// const panel3Arr = [
//   ['amphibian', 'Ambphibian'],
//   ['bird', 'Bird'],
//   ['mammal', 'mammal'],
//   ['marine', 'marine'],
//   ['marsu', 'marsu'],
//   ['reptile', 'reptile']
// ];
const elementsOne = [];
const elementsTwo = [];
// const elementsThree = [];

function createElement(id, value, n, url) {
  const element = document.createElement('div');
  element.id = id;
  element.innerHTML = value;
  element.addEventListener('mouseenter', () => {
    element.style.color = 'rgb(240,60,2)';
  });
  element.addEventListener('mouseleave', () => {
    if(element.selected) return;
    element.style.color = '';
  });
  element.addEventListener('click', () => {
    if(elementsOne.indexOf(element) >= 0) {
      elementsOne.forEach((e) => {
        e.selected = false;
        e.style.textDecoration = '';
        e.style.color = '';
      });
    } else if(elementsTwo.indexOf(element) >= 0) {
      elementsTwo.forEach((e) => {
        e.selected = false;
        e.style.textDecoration = '';
        e.style.color = '';
      });
    } else {
      elementsThree.forEach((e) => {
        e.selected = false;
        e.style.textDecoration = '';
        e.style.color = '';
      });
    }
    element.selected = true;
    element.style.color = 'rgb(240,60,2)';
    element.style.textDecoration = 'underline';
  });
  if(n === 1) elementsOne.push(element);
  if(n === 2) elementsTwo.push(element);
  // if(n === 3) elementsThree.push(element);
  return element;
}

function panelOne() {
  const h3 = document.createElement('h3');
  h3.innerHTML = 'By Geolocation';
  panel1.appendChild(h3);
  for (let i = 0; i < panel1Arr.length; i++) {
    panel1.appendChild(createElement(panel1Arr[i][0], panel1Arr[i][1], 1));
  }
}
function panelTwo() {
  const h3 = document.createElement('h3');
  h3.innerHTML = 'By Habitat';
  panel2.appendChild(h3);
  for (let i = 0; i < panel2Arr.length; i++) {
    panel2.appendChild(createElement(panel2Arr[i][0], panel2Arr[i][1], 2));
  }
}
// function panelThree() {
//   const h3 = document.createElement('h3');
//   // h3.innerHTML = 'By Time';
//   // panel3.appendChild(h3);
//   // for (let i = 0; i < panel3Arr.length; i++) {
//   //   panel3.appendChild(createElement(panel3Arr[i][0], panel3Arr[i][1], 3));
//   // }
//   const legendColor = document.createElement('IMG');
//   legendColor.src = ('./../img/leg_amph.png');
//     for (let i = 0; i < panel3Arr.length; i++) {
//     panel3.appendChild(createElement(panel3Arr[i][0], panel3Arr[i][1], 3));

// }

function switcher(i) {
  switch (i) {
    case 0:
      panelOne();
      break;
    case 1:
      panelTwo();
      break;
    default:
      break;
  }
}

for (let i = 0; i < 2; i++) {
  switcher(i);
}
