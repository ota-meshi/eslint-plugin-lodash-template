# eslint-plugin-lodash-template

ESLint plugin for John Resig-style micro templating.

[![NPM license](https://img.shields.io/npm/l/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)

It can be used in projects using [Underscore.js](http://underscorejs.org/#template) and [Lodash](https://lodash.com/docs/#template) 's template.

This plugin supports code checking for templates like the examples below.

```html
<div id="<%= id %>" class="<%= (i % 2 == 1 ? ' even': '') %>">
  <div class="grid_1 alpha right">
    <img class="righted" src="<%= profile_image_url %>"/>
  </div>
  <div class="grid_6 omega contents">
    <p><b><a href="/<%= from_user %>"><%= from_user %></a>:</b> <%= text %></p>
  </div>
</div>
```

```html
<% for ( var i = 0; i < users.length; i++ ) { %>
  <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
<% } %>
```

[***Playground on the Web***](./playground/README.md)

## Installation

```bash
npm install --save-dev eslint eslint-plugin-lodash-template
```

## Usage

Create `.eslintrc.*` file to configure rules. See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring).

Example **.eslintrc.js**:

```js
module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    // 'eslint:recommended',
    'plugin:lodash-template/recommended-with-html'
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'lodash-template/no-warning-html-comments': 'error'
  }
}
```

### Attention

This plugin does special handling for the following rule warnings in the template.

| Rule ID | Process Description | Another way this plugin supports |
|:--------|:--------------------|:---------------------------------|
| [`indent`](https://eslint.org/docs/rules/indent) | Disable warnings | [`lodash-template/script-indent`](./docs/rules/script-indent.md) rule,<br>[`lodash-template/html-indent`](./docs/rules/html-indent.md) rule |
| [`strict`](https://eslint.org/docs/rules/strict) | Disable warnings | -- |
| [`no-empty`](https://eslint.org/docs/rules/no-empty) | Disable warnings | -- |
| [`max-statements-per-line`](https://eslint.org/docs/rules/max-statements-per-line) | Disable warnings | -- |
| [`padded-blocks`](https://eslint.org/docs/rules/padded-blocks) | Disable warnings | -- |
| [`no-implicit-globals`](https://eslint.org/docs/rules/no-implicit-globals) | Disable warnings | -- |
| [`no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) | Disable warnings | [`lodash-template/no-multi-spaces-in-script`](./docs/rules/no-multi-spaces-in-script.md) rule,<br>[`lodash-template/no-multi-spaces-in-html-tag`](./docs/rules/no-multi-spaces-in-html-tag.md) rule |
| [`no-unused-expressions`](https://eslint.org/docs/rules/no-unused-expressions)| Disable warnings within interpolate(<%=...%>) | -- |
| [`quotes`](https://eslint.org/docs/rules/quotes) | Disable warnings if doublequote is set | -- |
| [`no-irregular-whitespace`](https://eslint.org/docs/rules/no-irregular-whitespace) | Disable warnings outside template tags | [`lodash-template/no-irregular-whitespace`](./docs/rules/no-irregular-whitespace.md) rule |

## All Rules

Please see [All Rules](./rules/README.md)

## Plugin Option

### Suppress `no-undef` warnings in the template tag

Please set the global variable used in all templates as follows.

**.eslintrc.json**:

```diff
  {
      "rules": {
+         "lodash-template/plugin-option": [2, {
+             "globals": ["variableName"],
+         }]
      }
  }
```

Please write the global comment in the file as follows for the variable to be used with a specific template.

```diff
+ <% /* global users */ %>
  <% for ( var i = 0; i < users.length; i++ ) { %>
    <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
  <% } %>
```

### Suppress reports for specific rules in template files

Please set as follows.

**.eslintrc.json**:

```diff
  {
      "rules": {
+         "lodash-template/plugin-option": [2, {
+             "ignoreRules": ["no-undef", "no-tabs"],
+         }]
      }
  }
```

The ESLint standard suppression method can also be used by using template tag, as follows.

```diff
+ <% /* eslint no-ternary: 0 */ %>
```

### Customize parser

For example, if you set [Lodash `templateSettings`](https://lodash.com/docs/#templateSettings) as follows,

```js
_.templateSettings = {
    evaluate:    /{{([\s\S]+?)}}/g,
    interpolate: /{{=([\s\S]+?)}}/g,
    escape:      /{{-([\s\S]+?)}}/g
};
```

please set `parserOptions`(ex. **.eslintrc.js**) as follows.

```diff
      parserOptions: {
+         templateSettings: {
+             evaluate:    ["{{", "}}"],
+             interpolate: ["{{=", "}}"],
+             escape:      ["{{-", "}}"],
+         },
      },
```

For example, to parse like [EJS](http://ejs.co/), set as follows,

```diff
      parserOptions: {
+         templateSettings: {
+             evaluate:    "(?:(?:<%_)|(?:<%(?!%)))([\\s\\S]*?)[_\\-]?%>",
+             interpolate: "<%-([\\s\\S]*?)[_\\-]?%>",
+             escape:      "<%=([\\s\\S]*?)[_\\-]?%>",
+         },
      },
```

([EJS](http://ejs.co/) can also be used in part, but we do not provide complete support.)

### Customize target extentions

Please set **.eslintrc.js** as follows.

(For example, for [EJS](http://ejs.co/).)

```diff
  "use strict"

+ const pluginLodashTemplate = require("eslint-plugin-lodash-template")
+ pluginLodashTemplate.addTargetExtensions(".ejs")

  module.exports = {
```

## FAQ

### Editor Settings

About how to mark warnings on editor.

* VSCode ([VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint))  

    **settings.json**:

    ```json
    {
        "eslint.validate": [ "javascript", "javascriptreact", { "language": "html", "autoFix": true } ]
    }
    ```

* Sublime Text3 ([SublimeLinter-eslint](https://packagecontrol.io/packages/SublimeLinter-eslint)) 

    [Preference] > [Package Settings] > [SublimeLinter] > [Settings]

    ```json
    // SublimeLinter Settings - User
    {
        "linters": {
            "eslint": {
                "selector": "text.html, source.js - meta.attribute-with-value"
            }
        }
    }
    ```

## Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### `parserServices`

[Information provided by `parserServices` on this plugin](./service/README.md)  

### Development Tools

- `npm test` runs tests and measures coverage.  
- `npm run update` runs in order to update readme and recommended configuration.  

## License

See the [LICENSE](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/LICENSE) file for license rights and limitations (MIT).
