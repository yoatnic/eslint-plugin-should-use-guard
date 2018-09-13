const fs = require("fs");
const esprima = require("esprima");

const ast = esprima.parseScript(fs.readFileSync("./target/index.js", "utf8"));

// console.log(JSON.stringify(ast, null, "  "));

const flat = arr => {
  return arr.reduce((acc, item) => {
    return Array.isArray(item) ? [...acc, ...flat(item)] : [...acc, item];
  }, []);
};

const detectIf = (node, acc) => {
  if (!node) return acc;
  if (Array.isArray(node)) {
    return node.map(n => detectIf(n, acc));
  }
  if (node.type === "Program") {
    const result = node.body.map(n => detectIf(n, acc)).reduce((item, a) => {
      return [...a, ...item];
    });
    return flat(result);
  }
  if (node.type === "ClassDeclaration") {
    return detectIf(node.body.body, acc);
  }
  if (node.type === "MethodDefinition") {
    return detectIf(node.value.body, acc);
  }
  if (node.type === "IfStatement") {
    return detectIf(node.body, [...acc, node]);
  }
  if (node.type === "BlockStatement") {
    console.log(node.body);
    return detectIf(node.body, acc);
  }

  return acc;
};

console.log(detectIf(ast, []));
