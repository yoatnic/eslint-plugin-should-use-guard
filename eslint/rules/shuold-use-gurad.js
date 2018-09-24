"use strict";

module.exports = function(context) {
  return {
    BlockStatement: function(node) {
      console.log(node);
    }
  };
};

module.exports.schema = [];
