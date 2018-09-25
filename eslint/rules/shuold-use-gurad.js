const detectIfBlock = require("../../index");

module.exports = function(context) {
  return {
    BlockStatement: function(node) {
      const result = detectIfBlock(node);

      if (result.length > 0) {
        context.report({ node: node, message: "shoud use guard" });
      }
    }
  };
};

module.exports.schema = [];
