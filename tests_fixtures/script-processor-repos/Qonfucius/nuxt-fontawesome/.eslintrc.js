module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
    },
    extends: ['airbnb-base'],
    // required to lint *.vue files
    plugins: [],
    // add your custom rules here
    rules: {
      'import/no-dynamic-require': 0,
      'global-require': 0,
  
    },
    globals: {},
    overrides: [
      {
        files: "*.js",
        extends: ["plugin:lodash-template/recommended-with-script"],
        parserOptions: {
          ecmaVersion: 2019,
        },
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  };