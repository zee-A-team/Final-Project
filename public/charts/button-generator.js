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
  ['legend_bird', null, './img/leg_bird.png', 'Bird'],
  ['legend_marine', null, './img/leg_marine.png', 'Marine'],
  ['legend_mammal', null, './img/leg_mammal.png', 'Mammal'],
  ['legend_marsu', null, './img/leg_marsu.png', 'Marsupial'],
  ['legend_reptile', null, './img/leg_reptile.png', 'Reptile'],
];

const elementsOne = [];
const elementsTwo = [];
const elementsThree = [];

function createElement(id, value, n, url, legendName) {
  const element = document.createElement('div');
  element.id = id;
  if (url) {
    let name = document.createElement('div');
    name.innerHTML = legendName;
    name.className = 'legend-text';
    element.appendChild(name);
    element.style.backgroundImage = `url('${url}')`;
    element.className = 'icon-images';
    elementsThree.push(element);
    return element;
  }
  element.innerHTML = value;
  element.addEventListener('mouseenter', () => {
    element.style.color = 'rgb(240,60,2)';
  });
  element.addEventListener('mouseleave', () => {
    if (element.selected) return;
    element.style.color = '';
  });
  element.addEventListener('click', () => {
    if (elementsOne.indexOf(element) >= 0) {
      elementsOne.forEach((e) => {
        e.selected = false;
        e.style.textDecoration = '';
        e.style.color = '';
      });
    } else if (elementsTwo.indexOf(element) >= 0) {
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
  if (n === 1) elementsOne.push(element);
  if (n === 2) elementsTwo.push(element);
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
function panelThree() {
  const h3 = document.createElement('h3');
  h3.innerHTML = 'Legend';
  panel3.appendChild(h3);
  for (let i = 0; i < panel3Arr.length; i++) {
    panel3.appendChild(createElement(panel3Arr[i][0], panel3Arr[i][1], 3, panel3Arr[i][2], panel3Arr[i][3]));
  }
}

panelOne();
panelTwo();
panelThree();

