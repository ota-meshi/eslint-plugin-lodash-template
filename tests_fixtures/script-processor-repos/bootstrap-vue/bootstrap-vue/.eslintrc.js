module.exports = {
  root: true,
  extends: ['standard', 'plugin:vue/recommended', 'plugin:prettier/recommended'],
  plugins: ['jest', 'markdown', 'node', 'promise'],
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  globals: {
    Vue: true
  },
  rules: {
    'spaced-comment': 'off', // needed to ignore `/*#__PURE__*/` comments
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'never',
          component: 'never'
        }
      }
    ],
    'vue/max-attributes-per-line': ['error', { singleline: 4 }],
    'vue/no-template-shadow': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/singleline-html-element-content-newline': 'off'
  },
  overrides: [
    {
      files: "*.js",
      extends: ["plugin:lodash-template/recommended-with-script"],
      globals: {
        options: true,
        serialize: true,
      },
      parserOptions: {
        parser: 'vue-eslint-parser',
        sourceType: 'module'
      },
      rules: {
        "prettier/prettier": "off"
      }
    }
  ]
};
