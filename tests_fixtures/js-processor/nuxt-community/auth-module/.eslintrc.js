module.exports = {
    root: true,
    // parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module'
    },
    env: {
      browser: true,
      node: true,
      jest: true
    },
    extends: 'standard',
    plugins: ['jest', 'vue'],
    rules: {
      // Allow paren-less arrow functions
      'arrow-parens': 0,
      // Allow async-await
      'generator-star-spacing': 0,
      // Allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      // Do not allow console.logs etc...
      'no-console': 2
    },
    globals: {
      'jest/globals': true,
      jasmine: true
    },
    overrides: [
      {
        files: ["*.js"],
        extends: [
          "plugin:lodash-template/base"
        ],
        processor: "lodash-template/js",
        globals: {
          options: true,
          serialize: true,
          hash: true
        }
      }
    ]
  }