const assert = require("power-assert");
const esprima = require("esprima");
const detectIfBlock = require("../index");

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

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
      const result = detectIfBlock(ast, []);

      assert(result.length === 0);
    });
  });
});
