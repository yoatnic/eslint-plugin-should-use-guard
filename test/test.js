const assert = require("power-assert");
const esprima = require("esprima");
const detectIfBlock = require("../index");

describe("Test", () => {
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
      const result = detectIfBlock(ast, []);

      assert(result.length === 1);
      assert(result[0].type === "BlockStatement");
      assert(result[0].body[0].type === "IfStatement");
    });
  });
});
