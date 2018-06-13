# eslint-plugin-lodash-template

[![NPM license](https://img.shields.io/npm/l/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&prefix=&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/eslint-plugin-lodash-template&maxAge=3600)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/npm/dw/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/npm/dy/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/npm/dt/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![Build Status](https://travis-ci.org/ota-meshi/eslint-plugin-lodash-template.svg?branch=master)](https://travis-ci.org/ota-meshi/eslint-plugin-lodash-template)  

ESLint plugin for John Resig-style micro templating.

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

output sample(on SublimeText):

![sample-sublime-text](./images/sample-sublime-text.png)

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

| Rule ID | Process Description |
|:--------|:------------|
| `indent` | Disable warnings |
| `strict` | Disable warnings |
| `no-empty` | Disable warnings |
| `max-statements-per-line` | Disable warnings |
| `padded-blocks` | Disable warnings |
| `no-implicit-globals` | Disable warnings |
| `no-multi-spaces` | Disable warnings |
| `no-unused-expressions` | Disable warnings within interpolate(<%=...%>) |
| `quotes` | Disable warnings if doublequote is set |

## Configs

This plugin provides four predefined configs:
- `plugin:lodash-template/base` - Settings and rules to enable correct ESLint parsing
- `plugin:lodash-template/best-practices` - Above, plus rules to improve dev experience
- `plugin:lodash-template/recommended` - Above, plus rules to improve code readability
- `plugin:lodash-template/recommended-with-html` - Above, plus rules to improve code readability with HTML tamplate
- `plugin:lodash-template/all` - All rules of this plugin are included

## Rules

The `--fix` option on the command line automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Base Rules (Enabling Correct ESLint Parsing)

Enforce all the rules in this category with:

```json
{
  "extends": "plugin:lodash-template/base"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [lodash-template/plugin-option](./docs/rules/plugin-option.md) | support option |

### Best Practices (Improve Development Experience)

Enforce all the rules in this category and all the rules in `Base` category with:

```json
{
  "extends": "plugin:lodash-template/best-practices"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [lodash-template/no-empty-template-tag](./docs/rules/no-empty-template-tag.md) | disallow empty micro-template tag. (ex. :ng: `<% %>`) |
|  | [lodash-template/no-html-comments](./docs/rules/no-html-comments.md) | disallow HTML comments. (ex. :ng: `<!-- comment -->`) |
|  | [lodash-template/no-warning-html-comments](./docs/rules/no-warning-html-comments.md) | disallow specified warning terms in HTML comments. (ex. :ng: `<!-- TODO:task -->`) |

### Recommended (Improve Readability)

Enforce all the rules in this category and all the rules in `Base`/`Best Practices` categories with:

```json
{
  "extends": "plugin:lodash-template/recommended"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [lodash-template/no-multi-spaces-in-script](./docs/rules/no-multi-spaces-in-script.md) | disallow multiple spaces in script. (ex. :ng: `<% if···(test)···{ %>`) |
| :wrench: | [lodash-template/script-indent](./docs/rules/script-indent.md) | enforce consistent indentation to script in micro-template tag. |
| :wrench: | [lodash-template/template-tag-spacing](./docs/rules/template-tag-spacing.md) | enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`) |

### Recommended with HTML template (Improve Readability with HTML template)

Enforce all the rules in this category and all the rules in `Base`/`Best Practices`/`Recommended` categories with:

```json
{
  "extends": "plugin:lodash-template/recommended-with-html"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [lodash-template/attribute-name-casing](./docs/rules/attribute-name-casing.md) | enforce attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`) |
| :wrench: | [lodash-template/attribute-value-quote](./docs/rules/attribute-value-quote.md) | enforce quotes style of HTML attributes. (ex. :ok: `<div class="abc">` :ng: `<div class='abc'>` `<div class=abc>`) |
| :wrench: | [lodash-template/element-name-casing](./docs/rules/element-name-casing.md) | enforce element name casing. (ex. :ok: `<xxx-element>` :ng: `<xxxElement>` `<DIV>`) |
| :wrench: | [lodash-template/html-closing-bracket-newline](./docs/rules/html-closing-bracket-newline.md) | require or disallow a line break before tag's closing brackets |
| :wrench: | [lodash-template/html-closing-bracket-spacing](./docs/rules/html-closing-bracket-spacing.md) | require or disallow a space before tag's closing brackets. (ex. :ok: `<input>` `<input·/>` :ng: `<input·>` `<input/>`) |
| :wrench: | [lodash-template/html-content-newline](./docs/rules/html-content-newline.md) | require or disallow a line break before and after html contents |
| :wrench: | [lodash-template/html-indent](./docs/rules/html-indent.md) | enforce consistent HTML indentation. |
| :wrench: | [lodash-template/max-attributes-per-line](./docs/rules/max-attributes-per-line.md) | enforce the maximum number of attributes per line |
| :wrench: | [lodash-template/no-multi-spaces-in-html-tag](./docs/rules/no-multi-spaces-in-html-tag.md) | disallow multiple spaces in html tags. (ex. :ng: `<input···type="text">`) |

### Uncategorized

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [lodash-template/no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md) | disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`) |
|  | [lodash-template/prefer-escape-template-interpolations](./docs/rules/prefer-escape-template-interpolations.md) | prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`) |

<!--RULES_TABLE_END-->

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

[Information provided by `parserServices` on this plugin](./docs/service/service.md)  

### Development Tools

- `npm test` runs tests and measures coverage.  
- `npm run update` runs in order to update readme and recommended configuration.  

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
