var RuleTester = require("eslint").RuleTester;

var tester = new RuleTester();
tester.run("shuold-use-gurad", require("../rules/shuold-use-gurad"), {
  valid: [
    {
      code: `function() {if (false) return;console.log("hoge");}`
    }
  ],
  invalid: [
    // {
    //   code: `function() {
    //     if (false) {
    //       console.log("hoge");
    //     }
    //   }`,
    //   error: ["Should use guard."]
    // }
  ]
});
