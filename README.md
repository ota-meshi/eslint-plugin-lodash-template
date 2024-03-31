# eslint-plugin-lodash-template

ESLint plugin for John Resig-style micro templating.

[![npm license]](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/eslint-plugin-lodash-template&maxAge=3600)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads]](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/npm/dy/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/npm/dt/eslint-plugin-lodash-template.svg)](http://www.npmtrends.com/eslint-plugin-lodash-template)
[![Build Status]](https://github.com/ota-meshi/eslint-plugin-lodash-template/actions?query=workflow%3ACI)
[![Coverage Status]](https://coveralls.io/github/ota-meshi/eslint-plugin-lodash-template?branch=master)

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

[***Playground on the Web***](https://eslint-online-playground.netlify.app/#eNqNUk2P2jAQ/SujSIiPDUm3hx7SQC/tuZeqlw1CxhkSbx3bsg2lQvz3jp2EAtVKqxxizbx5783HOXGW53hinZGYtb6TSZGUE8gX0Ei9YxIY5/qgvEvh4NA6WOQwWVeKMGMm22v7jfF2NjuLOgVj9V5I3IqONbg9WJnC3upuG8ovKYg5rNZwjiQAZS2OIOpVRaIreoRwAlwy54bYTMAEPsJqBc/wBaaAR1TTAqbTecRGloFnLGusqLfPwKRpGVjRtP6KI6TomisyJrEmSRrDIPif/6iTj0I5Kb0p+gl0hw0DrpVHGs2trlmXu3XJoLW4J3wetK6D6Xt5DJU5WxdlvltDyHg8+Rg0j17GBy3lEsei4pv2AjM4MgsCVvDhM/3KfouZRNX4liJPTzD/tw0pbhwGzYh+EZtsnEP0eI0q1uHgs8ypuLcQ2ZI0ydBJobzl2aujs+p0faAjw5PR1jtydCafoSlUtSvgpUp6fGGR666jaNhMClVi5KERqpC6Zq5deqRjZR7zG9zyt/DtMtxvlWzSwGuYJZffjRdaEXvUIjXesZ9knoIFEQcaR9cRKyrv9MFy/PHHYEj2fqsk5C4RoY9oac0Y3caKgbby4WT6JhYZvtLiexfho4Pi6Jy2UfGhh95yD+1F3iC957yd2nun47gVhprdDGrhR+8Lbcow/ouunUS0ok2RASCvNR6/ogkMigsk/TjGcHnjqkLoboq3yWVvbPlg7L4mlJCTS3L5C/4egQw=)

output sample(on SublimeText):

![sample-sublime-text](./images/sample-sublime-text.png)

## Features

- Enable [ESLint](http://eslint.org) in [Underscore.js](http://underscorejs.org/#template) and [Lodash](https://lodash.com/docs/#template)'s templates.
- You can find issues specific to template tags.
- Improves readability of HTML templates.
- For JavaScript (TypeScript) templates, enable [ESLint](http://eslint.org) both inside and outside the template tag. (*This is an experimental feature*)
- Partial supports for [EJS](http://ejs.co/).

## Installation

```bash
npm install --save-dev eslint eslint-plugin-lodash-template
```

## Documentation

See [documents](https://ota-meshi.github.io/eslint-plugin-lodash-template/).

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

| Rule ID                                | Process Description                           | Another way this plugin supports                                                                               |
| :------------------------------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| [`indent`]                             | Disable warnings                              | [`lodash-template/scriptlet-indent`] rule,<br>[`lodash-template/html-indent`]rule                              |
| [`@stylistic/indent`]                  | Disable warnings                              | [`lodash-template/scriptlet-indent`] rule,<br>[`lodash-template/html-indent`] rule                             |
| [`strict`]                             | Disable warnings                              | --                                                                                                             |
| [`no-empty`]                           | Disable warnings                              | --                                                                                                             |
| [`max-statements-per-line`]            | Disable warnings                              | --                                                                                                             |
| [`@stylistic/max-statements-per-line`] | Disable warnings                              | --                                                                                                             |
| [`padded-blocks`]                      | Disable warnings                              | --                                                                                                             |
| [`@stylistic/padded-blocks`]           | Disable warnings                              | --                                                                                                             |
| [`no-implicit-globals`]                | Disable warnings                              | --                                                                                                             |
| [`no-multi-spaces`]                    | Disable warnings                              | [`lodash-template/no-multi-spaces-in-scriptlet`] rule,<br>[`lodash-template/no-multi-spaces-in-html-tag`] rule |
| [`@stylistic/no-multi-spaces`]         | Disable warnings                              | [`lodash-template/no-multi-spaces-in-scriptlet`] rule,<br>[`lodash-template/no-multi-spaces-in-html-tag`] rule |
| [`no-unused-expressions`]              | Disable warnings within interpolate(<%=...%>) | --                                                                                                             |
| [`quotes`]                             | Disable warnings if doublequote is set        | --                                                                                                             |
| [`@stylistic/quotes`]                  | Disable warnings if doublequote is set        | --                                                                                                             |
| [`no-irregular-whitespace`]            | Disable warnings outside template tags        | [`lodash-template/no-irregular-whitespace`] rule                                                               |

[`indent`]: https://eslint.org/docs/rules/indent
[`lodash-template/scriptlet-indent`]: ./docs/rules/scriptlet-indent.md
[`lodash-template/html-indent`]: ./docs/rules/html-indent.md
[`@stylistic/indent`]: https://eslint.style/rules/default/indent
[`strict`]: https://eslint.org/docs/rules/strict
[`no-empty`]: https://eslint.org/docs/rules/no-empty
[`max-statements-per-line`]: https://eslint.org/docs/rules/max-statements-per-line
[`@stylistic/max-statements-per-line`]: https://eslint.style/rules/default/max-statements-per-line
[`padded-blocks`]: https://eslint.org/docs/rules/padded-blocks
[`@stylistic/padded-blocks`]: https://eslint.style/rules/default/padded-blocks
[`no-implicit-globals`]: https://eslint.org/docs/rules/no-implicit-globals
[`no-multi-spaces`]: https://eslint.org/docs/rules/no-multi-spaces
[`@stylistic/no-multi-spaces`]: https://eslint.style/rules/default/no-multi-spaces
[`lodash-template/no-multi-spaces-in-scriptlet`]: ./docs/rules/no-multi-spaces-in-scriptlet.md
[`lodash-template/no-multi-spaces-in-html-tag`]: ./docs/rules/no-multi-spaces-in-html-tag.md
[`no-unused-expressions`]: https://eslint.org/docs/rules/no-unused-expressions
[`quotes`]: https://eslint.org/docs/rules/quotes
[`@stylistic/quotes`]: https://eslint.style/rules/default/quotes
[`no-irregular-whitespace`]: https://eslint.org/docs/rules/no-irregular-whitespace
[`lodash-template/no-irregular-whitespace`]: ./docs/rules/no-irregular-whitespace.md

## Configs

This plugin provides 6 predefined configs:

- `plugin:lodash-template/base` - Settings and rules to enable correct ESLint parsing
- `plugin:lodash-template/best-practices` - Above, plus rules to improve dev experience
- `plugin:lodash-template/recommended` - Above, plus rules to improve code readability
- `plugin:lodash-template/recommended-with-html` - Above, plus rules to improve code readability with HTML template
- `plugin:lodash-template/recommended-with-script` - `plugin:lodash-template/recommended` config, plus to enable ESLint parsing of JavaScript templates (*This is an experimental feature*)
- `plugin:lodash-template/all` - All rules of this plugin are included

## Rules

The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Base Rules (Enabling Correct ESLint Parsing)

Enable this plugin using with:

```json
{
  "extends": "plugin:lodash-template/base"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [lodash-template/no-script-parsing-error](./docs/rules/no-script-parsing-error.md) | disallow parsing errors in template |

### Best Practices (Improve Development Experience)

Enforce all the rules in this category with:

```json
{
  "extends": "plugin:lodash-template/best-practices"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [lodash-template/no-empty-template-tag](./docs/rules/no-empty-template-tag.md) | disallow empty micro-template tag. (ex. :ng: `<% %>`) |
|  | [lodash-template/no-invalid-template-interpolation](./docs/rules/no-invalid-template-interpolation.md) | disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`) |
| :wrench: | [lodash-template/no-semi-in-template-interpolation](./docs/rules/no-semi-in-template-interpolation.md) | disallow the semicolon at the end of expression in micro template interpolation.(ex. :ok: `<%= text %>` :ng: `<%= text; %>`) |

### Recommended (Improve Readability)

Enforce all the rules in this category and all the rules in `Best Practices` categories with:

```json
{
  "extends": "plugin:lodash-template/recommended"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [lodash-template/no-irregular-whitespace](./docs/rules/no-irregular-whitespace.md) | disallow irregular whitespace outside the template tags. |
| :wrench: | [lodash-template/no-multi-spaces-in-scriptlet](./docs/rules/no-multi-spaces-in-scriptlet.md) | disallow multiple spaces in scriptlet. (ex. :ng: `<% if···(test)···{ %>`) |
| :wrench: | [lodash-template/scriptlet-indent](./docs/rules/scriptlet-indent.md) | enforce consistent indentation to scriptlet in micro-template tag. |
| :wrench: | [lodash-template/template-tag-spacing](./docs/rules/template-tag-spacing.md) | enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`) |

### Recommended with HTML template (Improve Readability with HTML template)

Enforce all the rules in this category and all the rules in `Best Practices`/`Recommended` categories with:

```json
{
  "extends": "plugin:lodash-template/recommended-with-html"
}
```

|    | Rule ID | Description |
|:---|:--------|:------------|
| :wrench: | [lodash-template/attribute-name-casing](./docs/rules/attribute-name-casing.md) | enforce HTML attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`) |
| :wrench: | [lodash-template/attribute-value-quote](./docs/rules/attribute-value-quote.md) | enforce quotes style of HTML attributes. (ex. :ok: `<div class="abc">` :ng: `<div class='abc'>` `<div class=abc>`) |
| :wrench: | [lodash-template/element-name-casing](./docs/rules/element-name-casing.md) | enforce HTML element name casing. (ex. :ok: `<xxx-element>` :ng: `<xxxElement>` `<DIV>`) |
| :wrench: | [lodash-template/html-closing-bracket-newline](./docs/rules/html-closing-bracket-newline.md) | require or disallow a line break before tag's closing brackets |
| :wrench: | [lodash-template/html-closing-bracket-spacing](./docs/rules/html-closing-bracket-spacing.md) | require or disallow a space before tag's closing brackets. (ex. :ok: `<input>` `<input·/>` :ng: `<input·>` `<input/>`) |
| :wrench: | [lodash-template/html-comment-content-newline](./docs/rules/html-comment-content-newline.md) | require or disallow a line break before and after HTML comment contents |
| :wrench: | [lodash-template/html-comment-spacing](./docs/rules/html-comment-spacing.md) | enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`) |
| :wrench: | [lodash-template/html-content-newline](./docs/rules/html-content-newline.md) | require or disallow a line break before and after HTML contents |
| :wrench: | [lodash-template/html-indent](./docs/rules/html-indent.md) | enforce consistent HTML indentation. |
| :wrench: | [lodash-template/max-attributes-per-line](./docs/rules/max-attributes-per-line.md) | enforce the maximum number of HTML attributes per line |
|  | [lodash-template/no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md) | disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`) |
|  | [lodash-template/no-html-comments](./docs/rules/no-html-comments.md) | disallow HTML comments. (ex. :ng: `<!-- comment -->`) |
| :wrench: | [lodash-template/no-multi-spaces-in-html-tag](./docs/rules/no-multi-spaces-in-html-tag.md) | disallow multiple spaces in HTML tags. (ex. :ng: `<input···type="text">`) |
| :wrench: | [lodash-template/no-space-attribute-equal-sign](./docs/rules/no-space-attribute-equal-sign.md) | disallow spacing around equal signs in attribute. (ex. :ok: `<div class="item">` :ng: `<div class = "item">`) |
|  | [lodash-template/no-warning-html-comments](./docs/rules/no-warning-html-comments.md) | disallow specified warning terms in HTML comments. (ex. :ng: `<!-- TODO:task -->`) |

### Uncategorized

|    | Rule ID | Description |
|:---|:--------|:------------|
|  | [lodash-template/no-template-tag-in-start-tag](./docs/rules/no-template-tag-in-start-tag.md) | disallow template tag in start tag outside attribute values. (ex. :ng: `<input <%= 'disabled' %> >`) |
|  | [lodash-template/prefer-escape-template-interpolations](./docs/rules/prefer-escape-template-interpolations.md) | prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`) |

<!--RULES_TABLE_END-->

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

### Customize target extensions

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

### For JavaScript (TypeScript) Templates

(*This is an experimental feature*. Also check for [known limitations](#known-limitations-in-script-templates).)

For example if you have a file like below.

```js
/* eslint no-multi-spaces: error */
<% /* eslint lodash-template/no-multi-spaces-in-scriptlet: error */ %>

// if this plugin is not used, a parsing error will occur.
const obj    = <%= JSON.stringify(options     ) %>
//       ^^^^                            ^^^^^ 
//         |                              |
//         |          If you don't use `"plugin:lodash-template/recommended-with-script"`,
//         |          only the space after `options` is reported.
//         |
//         + When using `"plugin:lodash-template/recommended-with-script"`, the space after `obj` is also reported.
```

[***Playground on the Web***](https://eslint-online-playground.netlify.app/#eNqdVMFu2zAM/RVCQLAti+270e60y3ZYDxu2Q9UirkzHymTRkOQ2QZd/H2W5qBM0w1rlEMUk33t8pPMovFMF7qquN5hvvShFsQT0RtsAlrJuMEFnvq8U+hLQOXKwLKS9WMBznqG68m0WkEGqgMVJXaZt5pXTfTAYnkFg8UlaaYsCdAOh1R56M2y0Bb5ZCjB4rFdQQV85r+1mqnvQxgApNbhcWkXWB6C7LfC5hIvFJXz9fvUt98FxhW7276kPmpNiHD6MjMyXzi2f6friifFbmBUA/PlXPofPJX9pYE8D1GTfjX3BWorUbHnqnUNFXYe2xjp70KGdnJNivTqHTtbs2UCE0W6omoAO1lPn62inw55cwJotm0Mc/foIv1q0rC56/SZ9L2i42478lfE0FyFWIk+741Rauo7qgRcQdzHH8ywfeTcC7gIz8eJdS5Hyyxm/FCv4f51t6IwUN+yiDHGl0F0lh8rExWyqq34iLxvZkoEjjOfGxgoZPA1O4Y99jzGY9EoRY4cxg+55QXUdX5PrVDHBytBokx6LZY5b/6QifnpH/IZ4ciPjSQ9JckpNJGdAjzHnrr12ijcTW/zi+4EnxQP9XW3inwNZnhQLANZa4/1n7COCVRqZf7QxLtLTqOKjIxfnwSwJy06EHdfEElZyEIe/wU2LAg==)

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
+            "processor": "lodash-template/script",
+            "rules": {
+                "lodash-template/no-invalid-template-interpolation": "error"
+                ...
+            }
        }
    ]
```

If you want to use it with TypeScript, you need to configure `parserOptions`.

```diff
    "overrides": [
        {
-            "files": ["**/your/templates/*.js"],
+            "files": ["**/your/templates/*.ts"],
+            "parserOptions": {
+                 "parser": "@typescript-eslint/parser",
+                 "sourceType": "module"
+            },
            "extends": ["plugin:lodash-template/recommended-with-script"]
        }
    ]
```

## FAQ

### Known Limitations in Script Templates

Due to known limitations in script templates, you may need to rewrite some templates. Otherwise, you may not be able to use this plugin or some rules.

#### Parsing Error

Interpolation in the script template will try to replace it with an identifier and parse it.
If you generate a complex script in interpolation, you may get a parsing error.

:+1: The following script can be parsed well.

```js
let <%= idName %> = 42;
export { <%= idName %> };
```

:-1: The following script cannot be parsed well.

```js
<%= 'let ' + idName %> = 42;
export { <%= idName %> };
```

#### False Positives in Some Rules

If you use branching in your template, the plugin will generate multiple script ASTs needed to cover all branches. (Then merge the results of validating these ASTs.)  
This can confuse some rules and cause false positives.

However, this is necessary to avoid script parsing errors.

e.g.

Template:

```js
const a = 'foo'
<% if (x) { %>
  const b = 1;
<% } else { %>
  const b = 2;
<% } %>
```

Generated Script 1:

```js

const a = 'foo'

  const b = 1;



```

Generated Script 2:

```js

const a = 'foo'



  const b = 2;

```

If we use the following script, it is a parsing error.

```js

const a = 'foo'

  const b = 1;

  const b = 2; // <- Identifier 'b' has already been declared

```

The plugin also tries to generate scripts using branches that are as consistent as possible.

e.g.

Template:

```js
<% if (x.foo) { %>
  const a = 'x.foo is true'
<% } %>
// ...
<% if (x.foo) { %>
  console.log(a)
<% } else { %>
  // process for x.foo is false
<% } %>
```

Generated Script 1:

```js

  const a = 'x.foo is true'

// ...

  console.log(a)



```

Generated Script 2:

```js



// ...



  // process for x.foo is false

```

However, branching conditions are compared using text, so even logically the same can be confusing.

e.g.

Template:

```js
<% if (x['foo']) { %>
  const a = 'x.foo is true'
<% } %>
// ...
<% if (x.foo) { %>
  console.log(a)
<% } else { %>
  // process for x.foo is false
<% } %>
```

Generated Script 1:

```js

  const a = 'x.foo is true'

// ...

  console.log(a)



```

Generated Script 2:

```js

  const a = 'x.foo is true'

// ...



  // process for x.foo is false

```

This template gets an error `'a' is assigned a value but never used.` from the `no-unused-vars` rule.

### Editor Settings with HTML templates

About how to mark warnings on editor.

- VSCode ([VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint))  

    **settings.json**:

    ```json
    {
        "eslint.validate": [ "javascript", "javascriptreact", "html" ]
    }
    ```

- Sublime Text3 ([SublimeLinter-eslint](https://packagecontrol.io/packages/SublimeLinter-eslint)) 

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

- [0.13.x to 0.14.x](https://ota-meshi.github.io/eslint-plugin-lodash-template/migration/0.13to0.14.html)

## Contributing

Welcome contributing!

Please use GitHub's Issues/PRs.

### `parserServices`

[Information provided by `parserServices` on this plugin](./docs/services/index.md)  

### Development Tools

- `npm test` runs tests and measures coverage.  
- `npm run update` runs in order to update readme and recommended configuration.  

## License

See the [LICENSE] file for license rights and limitations (MIT).

[license]: ./LICENSE
[npm license]: https://img.shields.io/npm/l/eslint-plugin-lodash-template.svg
[npm version]: https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg
[npm downloads]: https://img.shields.io/npm/dw/eslint-plugin-lodash-template.svg
[Build Status]: https://github.com/ota-meshi/eslint-plugin-lodash-template/workflows/CI/badge.svg?branch=master
[Coverage Status]: https://coveralls.io/repos/github/ota-meshi/eslint-plugin-lodash-template/badge.svg?branch=master
[Greenkeeper badge]: https://badges.greenkeeper.io/ota-meshi/eslint-plugin-lodash-template.svg
