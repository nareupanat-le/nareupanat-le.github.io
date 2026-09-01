const fs = require('fs');
const files = fs.readdirSync('js/limits').map(f => 'js/limits/' + f)
  .concat(fs.readdirSync('js/derivatives').map(f => 'js/derivatives/' + f))
  .concat(['js/utils.js', 'js/app.js']);

for (let file of files) {
  try {
    let code = fs.readFileSync(file, 'utf8');
    new Function(code);
  } catch(e) {
    console.error("Syntax Error in " + file + ": " + e);
  }
}
console.log("Done checking with Node");
