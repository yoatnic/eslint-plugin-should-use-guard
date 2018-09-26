const includeOnlyNoAltIfStatement = require("../../index");

module.exports = function(context) {
  return {
    BlockStatement: function(node) {
      const result = includeOnlyNoAltIfStatement(node.body);

      if (result) {
        context.report({ node: node, message: "shoud use guard" });
      }
    }
  };
};

module.exports.schema = [];
