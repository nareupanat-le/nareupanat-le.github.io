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
console.log("Testing topic: derivative");
setTopic('derivative');
generateNextProblem();
console.log("Success! currentProblem:", currentProblem.probLatex);

console.log("Testing topic: implicit");
setTopic('implicit');
generateNextProblem();
console.log("Success! currentProblem:", currentProblem.probLatex);

console.log("Testing topic: tangent_normal");
setTopic('tangent_normal');
generateNextProblem();
console.log("Success! currentProblem:", currentProblem.probLatex);

console.log("Testing topic: all");
setTopic('all');
generateNextProblem();
console.log("Success! currentProblem:", currentProblem.probLatex);
`;

try {
  eval(fullCode);
  console.log("ALL TESTS PASSED!");
} catch(e) {
  console.error("CRASH:", e);
}
