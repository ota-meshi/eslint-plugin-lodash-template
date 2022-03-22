module.exports = {
  'root': true,
  'parserOptions': {
    'ecmaVersion': 9,
    'sourceType': 'module'
  },
  'env': {
    'node': true,
    'es6': true,
    'jest': true
  },
  'plugins': [
    'unicorn'
  ],
  'extends': [
    'standard',
    'plugin:unicorn/recommended',
    // 'prettier/unicorn',
    // 'prettier/standard'
    'prettier'
  ],
  'rules': {
    'curly': [
      'error',
      'all'
    ],
    'no-console': 1,
    'no-debugger': 1,
    'valid-jsdoc': ['error'],
    'space-before-function-paren': 0,
  },
  'globals': {
    'jest/globals': true,
    'jasmine': true
  },
  overrides: [
    {
      files: "*.js",
      extends: ["plugin:lodash-template/recommended-with-script"],
      globals: {
        options: true,
        serialize: true,
      }
    }
  ]
}