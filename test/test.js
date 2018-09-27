const assert = require("power-assert");
const esprima = require("esprima");
const { includeOnlyNoAltIfStatement } = require("../index");
const flat = arr => {
  return arr.reduce((acc, item) => {
    return Array.isArray(item) ? [...acc, ...flat(item)] : [...acc, item];
  }, []);
};

const traverse = (node, acc) => {
  if (!node) return acc;
  if (Array.isArray(node)) {
    return node.map(n => traverse(n, acc));
  }
  if (node.type === "Program") {
    const result = node.body.map(n => traverse(n, acc)).reduce((item, a) => {
      return [...a, ...item];
    });
    return flat(result);
  }
  if (node.type === "ClassDeclaration") {
    return traverse(node.body.body, acc);
  }
  if (node.type === "MethodDefinition") {
    return traverse(node.value.body, acc);
  }
  if (node.type === "FunctionDeclaration") {
    return traverse(node.body, acc);
  }
  if (node.type === "ArrowFunctionExpression") {
    return traverse(node.body, acc);
  }
  if (node.type === "VariableDeclaration") {
    const result = node.declarations
      .map(n => traverse(n, acc))
      .reduce((item, a) => {
        return [...a, ...item];
      });
    return flat(result);
  }
  if (node.type === "ExpressionStatement") {
    return traverse(node.expression, acc);
  }
  if (node.type === "CallExpression") {
    const result = node.arguments
      .map(n => traverse(n, acc))
      .reduce((item, a) => {
        return [...a, ...item];
      });
    return flat(result);
  }
  if (node.type === "VariableDeclarator") {
    return traverse(node.init, acc);
  }
  if (node.type === "BlockStatement") {
    const ifStatementOnly = includeOnlyNoAltIfStatement(node.body);
    return ifStatementOnly ? [...acc, node] : acc;
  }

  return acc;
};

describe("Test", () => {
  describe("Class Method", () => {
    it("if only no else", () => {
      const ast = esprima.parseScript(
        `
        class C {
          method() {
            if (true) {
              console.log("hoge");
            }
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "IfStatement");
    });

    it("if with declare var", () => {
      const ast = esprima.parseScript(
        `
        class C {
          method() {
            const x = true;
            if (x) {
              console.log("hoge");
            }
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "VariableDeclaration");
      assert(result[0].body[1].type === "IfStatement");
    });

    it("if and else", () => {
      const ast = esprima.parseScript(
        `
        class C {
          method() {
            if (true) {
              console.log("hoge");
            }
            else {
              console.log("fuga");
            }
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });

    it("if with expression", () => {
      const ast = esprima.parseScript(
        `
        class C {
          method() {
            if (true) {
              console.log("hoge");
            }
            console.log("fuga");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });
  });

  describe("Heigher function", () => {
    it("if only no else", () => {
      const ast = esprima.parseScript(
        `
        [1].forEach(() => {
          if (true) {
            console.log("hoge");
          }
        })
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "IfStatement");
    });

    it("if with declare var", () => {
      const ast = esprima.parseScript(
        `
        [1].forEach(() => {
          const x = true;
          if (x) {
            console.log("hoge");
          }
        });
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "VariableDeclaration");
      assert(result[0].body[1].type === "IfStatement");
    });

    it("if and else", () => {
      const ast = esprima.parseScript(
        `
        [1].forEach(() => {
          if (true) {
            console.log("hoge");
          }
          else {
            console.log("fuga");
          }
        })
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });

    it("if with expression", () => {
      const ast = esprima.parseScript(
        `
        [1].forEach(() => {
          if (true) {
            console.log("hoge");
          }
          console.log("fuga");
        })
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });
  });

  describe("Arrow Function with declare var", () => {
    it("if only no else", () => {
      const ast = esprima.parseScript(
        `
        const x = () => {
          if (true) {
            console.log("hoge");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "IfStatement");
    });

    it("if with declare var", () => {
      const ast = esprima.parseScript(
        `
        const x = () => {
          const y = true;
          if (y) {
            console.log("hoge");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "VariableDeclaration");
      assert(result[0].body[1].type === "IfStatement");
    });

    it("if and else", () => {
      const ast = esprima.parseScript(
        `
        const x = () => {
          if (true) {
            console.log("hoge");
          }
          else {
            console.log("fuga");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });

    it("if with expression", () => {
      const ast = esprima.parseScript(
        `
        const x = () => {
          if (true) {
            console.log("hoge");
          }
          console.log("fuga");
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });
  });

  describe("Function", () => {
    it("if only no else", () => {
      const ast = esprima.parseScript(
        `
        function f() {
          if (true) {
            console.log("hoge");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "IfStatement");
    });

    it("if with declare var", () => {
      const ast = esprima.parseScript(
        `
        function f() {
          const x = true;
          if (x) {
            console.log("hoge");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "VariableDeclaration");
      assert(result[0].body[1].type === "IfStatement");
    });

    it("if and else", () => {
      const ast = esprima.parseScript(
        `
        function f() {
          if (true) {
            console.log("hoge");
          }
          else {
            console.log("fuga");
          }
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });

    it("if with expression", () => {
      const ast = esprima.parseScript(
        `
        function f() {
          if (true) {
            console.log("hoge");
          }
          console.log("fuga");
        }
      `,
        {
          loc: true
        }
      );
      const result = traverse(ast, []);

      assert(result.length === 0);
    });
  });
});
