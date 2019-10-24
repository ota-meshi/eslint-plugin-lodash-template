# eslint-plugin-lodash-template

ESLint plugin for John Resig-style micro templating.

[![NPM license](https://img.shields.io/npm/l/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![NPM downloads](https://img.shields.io/npm/dm/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)

It can be used in projects using [Underscore.js](http://underscorejs.org/#template) and [Lodash](https://lodash.com/docs/#template)'s template.

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

## Features

- Enable [ESLint](http://eslint.org) in [Underscore.js](http://underscorejs.org/#template) and [Lodash](https://lodash.com/docs/#template)'s templates.
- You can find issues specific to template tags.
- Improves readability of HTML templates.
- For JavaScript templates, enable [ESLint](http://eslint.org) both inside and outside the template tag. (*This is an experimental feature*)
- Partial supports for [EJS](http://ejs.co/).

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
| [`indent`](https://eslint.org/docs/rules/indent) | Disable warnings | [`lodash-template/scriptlet-indent`](./docs/rules/scriptlet-indent.md) rule,<br>[`lodash-template/html-indent`](./docs/rules/html-indent.md) rule |
| [`strict`](https://eslint.org/docs/rules/strict) | Disable warnings | -- |
| [`no-empty`](https://eslint.org/docs/rules/no-empty) | Disable warnings | -- |
| [`max-statements-per-line`](https://eslint.org/docs/rules/max-statements-per-line) | Disable warnings | -- |
| [`padded-blocks`](https://eslint.org/docs/rules/padded-blocks) | Disable warnings | -- |
| [`no-implicit-globals`](https://eslint.org/docs/rules/no-implicit-globals) | Disable warnings | -- |
| [`no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) | Disable warnings | [`lodash-template/no-multi-spaces-in-scriptlet`](./docs/rules/no-multi-spaces-in-scriptlet.md) rule,<br>[`lodash-template/no-multi-spaces-in-html-tag`](./docs/rules/no-multi-spaces-in-html-tag.md) rule |
| [`no-unused-expressions`](https://eslint.org/docs/rules/no-unused-expressions)| Disable warnings within interpolate(<%=...%>) | -- |
| [`quotes`](https://eslint.org/docs/rules/quotes) | Disable warnings if doublequote is set | -- |
| [`no-irregular-whitespace`](https://eslint.org/docs/rules/no-irregular-whitespace) | Disable warnings outside template tags | [`lodash-template/no-irregular-whitespace`](./docs/rules/no-irregular-whitespace.md) rule |

## Configs

This plugin provides four predefined configs:

- `plugin:lodash-template/base` - Settings and rules to enable correct ESLint parsing
- `plugin:lodash-template/best-practices` - Above, plus rules to improve dev experience
- `plugin:lodash-template/recommended` - Above, plus rules to improve code readability
- `plugin:lodash-template/recommended-with-html` - Above, plus rules to improve code readability with HTML tamplate
- `plugin:lodash-template/recommended-with-script` - `plugin:lodash-template/recommended` config, plus to enable ESLint parsing of JavaScript templates (*This is an experimental feature*)
- `plugin:lodash-template/all` - All rules of this plugin are included

## All Rules

Please see [All Rules](./rules/README.md)

## Plugin Option

### Suppress `no-undef` warnings in the template tag

Please set the global variable used in all templates as follows.

**.eslintrc.\***:

```diff
  {
      "settings": {
+         "lodash-template/globals": ["variableName"]
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

**.eslintrc.\***:

```diff
  {
      "settings": {
+         "lodash-template/ignoreRules": ["no-undef", "no-tabs"]
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

please set `parserOptions`(ex. **.eslintrc.\***) as follows.

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

(If `plugin:lodash-template/***` is set in `extends`, it is automatically applied to the extension `.ejs`.)

```diff
      parserOptions: {
+         templateSettings: {
+             evaluate:    [ ["<%", "<%_"], ["%>", "-%>", "_%>"] ],
+             interpolate: [  "<%-",        ["%>", "-%>", "_%>"] ],
+             escape:      [  "<%=",        ["%>", "-%>", "_%>"] ],
+             comment:     [  "<%#",        ["%>", "-%>", "_%>"] ],
+             literal:     [  "<%%" ],
+         },
      },
```

(This plugin do not provide complete support for [EJS](http://ejs.co/). e.g. the `include` directive.)

### Customize target extentions

Please set **.eslintrc.\*** as follows.

(For example, for [EJS](http://ejs.co/).)

```diff
+    "overrides": [
+        {
+            "files": ["*.ejs"],
+            "processor": "lodash-template/html"
+        }
+    ]
```

### For JavaScript Templates

(*This is an experimental feature*)

For example if you have a file like below.

```js
/* eslint no-multi-spaces: error */
<% /* eslint lodash-template/no-multi-spaces-in-scriptlet: error */ %>

// if this plugin is not used, a parsing error will occur.
const obj    = <%= JSON.stringify(options     ) %>
//       ^^^^                          ^^^^^ 
//         |                            |
//         |          If you don't use `"plugin:lodash-template/recommended-with-script"`,
//         |          only the space after `options` is reported.
//         |
//         + When using `"plugin:lodash-template/recommended-with-script"`, the space after `obj` is also reported.
```

[***Playground on the Web***](https://ota-meshi.github.io/eslint-plugin-lodash-template/playground/#eJyrVipOLsosKFGyKikqTa0FAC0nBcw=)

#### Configuring

Please set **.eslintrc.\*** as follows.

```diff
+    "overrides": [
+        {
+            "files": ["**/your/templates/*.js"],
+            "extends": ["plugin:lodash-template/recommended-with-script"]
+        }
+    ]
```

If you do not want to use the included rules, set the details as follows.

```diff
    "overrides": [
        {
            "files": ["**/your/templates/*.js"],
-            "extends": ["plugin:lodash-template/recommended-with-script"],
+            "extends": ["plugin:lodash-template/base"],
+            "processor": "lodash-template/script"
        }
    ]
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

## Migrations

- [0.13.x to 0.14.x](./migration/0.13to0.14.md)

## Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### `parserServices`

[Information provided by `parserServices` on this plugin](./services/README.md)  

### Development Tools

- `npm test` runs tests and measures coverage.  
- `npm run update` runs in order to update readme and recommended configuration.  

## License

See the [LICENSE](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/LICENSE) file for license rights and limitations (MIT).
