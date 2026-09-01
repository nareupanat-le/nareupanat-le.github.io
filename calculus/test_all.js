const fs = require('fs');
global.window = { addEventListener: ()=>{} };
global.document = {
  getElementById: (id) => ({
    id: id,
    classList: { add: ()=>{}, remove: ()=>{}, toggle: ()=>{} },
    innerHTML: '', textContent: '', addEventListener: ()=>{}, value: '', style: {}
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
let errors = [];
for (let g of allGenerators) {
  try {
    let obj = g();
    if (!obj || !obj.difficulty) throw new Error("Invalid object returned");
  } catch(e) {
    errors.push({name: g.name, error: e.message});
  }
}
if (errors.length > 0) {
  console.log("ERRORS FOUND:");
  console.log(errors);
} else {
  console.log("ALL GENERATORS WORKED!");
}
`;
eval(fullCode);
