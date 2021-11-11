// Import stylesheets
import './style.css';
import * as api from './src/extractData';
import * as path from './src/testData.json';
// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
const multi_select = api.extractInputMultiSelect(path);
// console.log(multi_select);
const line = api.extractLines(path);
// console.log('line', line);
const box2d = api.extractBox2ds(path);
console.log('box2d', box2d);
const point = api.extractPoints(path);
// console.log('point', point);
appDiv.innerHTML = `
  <h1>Hello candidate!</h1>
  <h2>Welcome to Stardust tech interview!</h2>
  <div>
    Look
    <a href="http://stardust.ai/" target="_blank" rel="noopener noreferrer">here</a>
    for more info about us.
  </div>
  `;
