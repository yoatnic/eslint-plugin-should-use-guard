const fs = require("fs");
const esprima = require("esprima");

const ast = esprima.parseScript(fs.readFileSync("./target/index.js", "utf8"));

console.log(JSON.stringify(ast, null, "  "));
