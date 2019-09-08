module.exports = {
    root: true,
    parser: 'babel-eslint',
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
        extends: ["plugin:lodash-template/recommended-with-js"],
        parserOptions: {
          parser: 'babel-eslint',
        },
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  };