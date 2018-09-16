const fs = require("fs");
const esprima = require("esprima");

const ast = esprima.parseScript(fs.readFileSync("./target/index.js", "utf8"), {
  loc: true
});

const flat = arr => {
  return arr.reduce((acc, item) => {
    return Array.isArray(item) ? [...acc, ...flat(item)] : [...acc, item];
  }, []);
};

const includeOnlyNoAltIfStatement = node => {
  if (node.length > 1) return false;
  if (node[0].type !== "IfStatement") return false;
  return !node[0].alternate;
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
  if (node.type === "ArrowFunctionExpression") {
    return detectIf(node.body, acc);
  }
  if (node.type === "VariableDeclaration") {
    const result = node.declarations
      .map(n => detectIf(n, acc))
      .reduce((item, a) => {
        return [...a, ...item];
      });
    return flat(result);
  }
  if (node.type === "VariableDeclarator") {
    return detectIf(node.init, acc);
  }
  if (node.type === "BlockStatement") {
    const ifStatementOnly = includeOnlyNoAltIfStatement(node.body);
    if (ifStatementOnly) console.log(JSON.stringify(node.body, null, "  "));
    return detectIf(node.body, ifStatementOnly ? [...acc, node] : acc);
  }

  return acc;
};

const result = detectIf(ast, []);
console.log(`detected nodes: ${result.length}`);
console.log(JSON.stringify(result, null, "  "));
