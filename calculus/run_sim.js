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
  .concat(fs.readdirSync('js/derivatives').map(f => 'js/derivatives/' + f))
  .concat(['js/app.js']);

let fullCode = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');
fullCode += `
setTopic('derivative');
setMode('free');
setFilterDifficulty('easy');

console.log("Calling generateNextProblem()...");
generateNextProblem();
console.log("Success! currentProblem:", currentProblem.probLatex);
`;

try {
  eval(fullCode);
} catch(e) {
  console.error("CRASH:", e);
}
