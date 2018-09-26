const fs = require("fs");
const esprima = require("esprima");

const ast = esprima.parseScript(fs.readFileSync("./target/index.js", "utf8"), {
  // loc: true
});

const flat = arr => {
  return arr.reduce((acc, item) => {
    return Array.isArray(item) ? [...acc, ...flat(item)] : [...acc, item];
  }, []);
};

const includeOnlyNoAltIfStatement = node => {
  const excludeVar = node.filter(n => n.type !== "VariableDeclaration");
  if (excludeVar.length > 1) return false;
  if (excludeVar[0].type !== "IfStatement") return false;
  return !excludeVar[0].alternate;
};

module.exports = includeOnlyNoAltIfStatement;

const detectIfBlock = (node, acc) => {
  if (!node) return acc;
  if (Array.isArray(node)) {
    return node.map(n => detectIfBlock(n, acc));
  }
  if (node.type === "Program") {
    const result = node.body
      .map(n => detectIfBlock(n, acc))
      .reduce((item, a) => {
        return [...a, ...item];
      });
    return flat(result);
  }
  if (node.type === "ClassDeclaration") {
    return detectIfBlock(node.body.body, acc);
  }
  if (node.type === "MethodDefinition") {
    return detectIfBlock(node.value.body, acc);
  }
  if (node.type === "FunctionDeclaration") {
    return detectIfBlock(node.body, acc);
  }
  if (node.type === "ArrowFunctionExpression") {
    return detectIfBlock(node.body, acc);
  }
  if (node.type === "VariableDeclaration") {
    const result = node.declarations
      .map(n => detectIfBlock(n, acc))
      .reduce((item, a) => {
        return [...a, ...item];
      });
    return flat(result);
  }
  if (node.type === "ExpressionStatement") {
    return detectIfBlock(node.expression, acc);
  }
  if (node.type === "CallExpression") {
    const result = node.arguments
      .map(n => detectIfBlock(n, acc))
      .reduce((item, a) => {
        return [...a, ...item];
      });
    return flat(result);
  }
  if (node.type === "VariableDeclarator") {
    return detectIfBlock(node.init, acc);
  }
  if (node.type === "BlockStatement") {
    const ifStatementOnly = includeOnlyNoAltIfStatement(node.body);
    return ifStatementOnly ? [...acc, node] : acc;
  }

  return acc;
};

// const result = detectIfBlock(ast, []);
// console.log(`detected nodes: ${result.length}`);
// console.log(JSON.stringify(ast, null, "  "));
// console.log(JSON.stringify(result, null, "  "));
