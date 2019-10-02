module.exports = {
    root: true,
    parserOptions: {
      sourceType: 'module'
    },
    env: {
      browser: true,
      node: true,
      jest: true
    },
    extends: ['standard'],
    plugins: [
      'jest',
      'vue'
    ],
    rules: {
      // Allow paren-less arrow functions
      'arrow-parens': 0,
      // Allow async-await
      'generator-star-spacing': 0,
      // Allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
      // Do not allow console.logs etc...
      'no-console': 1,
      // Disalow semicolons
      'semi': ['error', 'never']
    },
    globals: {
      'jest/globals': true,
      jasmine: true
    },
    overrides: [
      {
        files: "*.js",
        extends: ["plugin:lodash-template/recommended-with-script"],
        parserOptions: {
          parser: 'babel-eslint'
        },
        globals: {
          options: true,
          serialize: true,
        }
      }
    ]
  }