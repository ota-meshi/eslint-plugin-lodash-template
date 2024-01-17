"use strict";

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018
  },
  env: {},
  extends: ["eslint:all", "plugin:lodash-template/base", "plugin:@stylistic/all-extends"],
  overrides: [
    {
      files: ["*.ejs"],
      processor: "lodash-template/html",
      globals: {
        include: true,
        include: true
      },
      parserOptions: {
        templateSettings: {
          evaluate: "(?:(?:<%_)|(?:<%(?!%)))([\\s\\S]*?)[_\\-]?%>",
          interpolate: "<%-([\\s\\S]*?)[_\\-]?%>",
          escape: "<%=([\\s\\S]*?)[_\\-]?%>"
        }
      }
    }
  ]
};
