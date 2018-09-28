const includeOnlyNoAltIfStatement = node => {
  if (node.length === 0) return false;
  const excludeVar = node.filter(n => n.type !== "VariableDeclaration");
  if (excludeVar.length > 1) return false;
  if (excludeVar[0].type !== "IfStatement") return false;
  return !excludeVar[0].alternate;
};

module.exports.includeOnlyNoAltIfStatement = includeOnlyNoAltIfStatement;

module.exports.rules = {
  "should-use-guard": function(context) {
    return {
      BlockStatement: function(node) {
        const result = includeOnlyNoAltIfStatement(node.body);

        if (result) {
          context.report({ node: node, message: "shoud use guard" });
        }
      }
    };
  }
};

module.exports.schema = [];
