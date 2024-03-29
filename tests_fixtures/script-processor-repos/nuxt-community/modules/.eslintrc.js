module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: ["standard"],
  // required to lint *.vue files
  // plugins: ["html"],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    "arrow-parens": 0,
    // allow async-await
    "generator-star-spacing": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    // do not allow console.logs etc...
    "no-console": 2
  },
  globals: {},
  overrides: [
    {
      files: "*.js",
      extends: ["plugin:lodash-template/recommended-with-script"],
      parserOptions: {
        sourceType: 'module'
      },
      globals: {
        options: true,
        serialize: true,
      }
    }
  ]
};
