const fs = require('fs');

global.window = { addEventListener: ()=>{} };
global.document = {
  getElementById: (id) => ({
    id: id,
    classList: { add: ()=>{}, remove: ()=>{}, toggle: ()=>{} },
    innerHTML: '',
    textContent: '',
    addEventListener: ()=>{},
    value: '',
    style: {}
  }),
  addEventListener: ()=>{}
};
global.MathJax = { typesetPromise: async ()=>{} };

const files = ['js/utils.js']
  .concat(fs.readdirSync('js/limits').map(f => 'js/limits/' + f))
  .concat(fs.readdirSync('js/derivatives').map(f => 'js/derivatives/' + f))
  .concat(['js/app.js']);

let fullCode = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
fullCode += `
currentTopic = 'limit';
currentMode = 'filter';
filterDifficulty = 'easy';
generateNextProblem();
console.log("Success! Problem is: " + currentProblem.probLatex);
`;

try {
  eval(fullCode);
} catch(e) {
  console.error("CRASH:", e);
}
