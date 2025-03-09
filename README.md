# eslint-plugin-lodash-template

ESLint plugin for John Resig-style micro templating.

[![npm license]](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-lodash-template.svg)](https://www.npmjs.com/package/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/badge/dynamic/json.svg?label=downloads&colorB=green&suffix=/day&query=$.downloads&uri=https://api.npmjs.org//downloads/point/last-day/eslint-plugin-lodash-template&maxAge=3600)](https://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads]](https://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-lodash-template.svg)](https://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/npm/dy/eslint-plugin-lodash-template.svg)](https://www.npmtrends.com/eslint-plugin-lodash-template)
[![npm downloads](https://img.shields.io/npm/dt/eslint-plugin-lodash-template.svg)](https://www.npmtrends.com/eslint-plugin-lodash-template)
[![Build Status]](https://github.com/ota-meshi/eslint-plugin-lodash-template/actions?query=workflow%3ACI)
[![Coverage Status]](https://coveralls.io/github/ota-meshi/eslint-plugin-lodash-template?branch=master)

It can be used in projects using [Underscore.js](https://underscorejs.org/#template) and [Lodash](https://lodash.com/docs/#template)'s template.

This plugin supports code checking for templates like the examples below.

```html
<div id="<%= id %>" class="<%= (i % 2 == 1 ? ' even': '') %>">
    <div class="grid_1 alpha right">
        <img class="righted" src="<%= profile_image_url %>" />
    </div>
    <div class="grid_6 omega contents">
        <p>
            <b><a href="/<%= from_user %>"><%= from_user %></a>:</b> <%= text %>
        </p>
    </div>
</div>
```

```html
<% for ( var i = 0; i < users.length; i++ ) { %>
<li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
<% } %>
```

[**_Playground on the Web_**](https://eslint-online-playground.netlify.app/#eNqNU01v2kAQ/SsjSxGEELvpoQdqaA+tVPXSQ6P2gBFa1oO9dD+s3TWiQvz3zq4NCTREERK2Z968N377vE+c5RnumGokprVXMpkk+Q1kI6ikWTEJjHPTau/G0Dq0DkYZ3MwKTZhjJ10b+5Xxejjci3IMjTVrIXEpFKtw2Vo5hrU1ahnGD2MQtzCdwT6SAOSl2IIopwWJTukmlBPgkjnX14YCbuA9TKfwAJ9gALhFPZjAYHAbsZGl5zmOVVaUywdgsqkZWFHV/oQjpFDVCRmbWJIk2dAL/rd/1MmOQhkpXRX9AEZhxYAb7ZGsea7bzPLVLGdQW1wTPgtaJ2O6d7ks5RmbTfJsNYPQ8bjzsdhc7nK8oUM5RFt0vKdzgSFsmQUBU3j3kS55d4qpRF35mip3d3D7dBpSPNswaEb0XCzSow9xx1NVM4X9nnlGw90KkS0ZJ+ik0D4lM9aiStXGUbaEaoz10LW+u/i6MPjcPWcbNyh0D5GmZK5+REom89gDO9x9I9tK6PsOcu97DM0WGndxusQ1a6WHOdX8Ua1fxaUWuVEKdYnlOADOtV6C/Ra+/kafR4DTwD780RzTVUsx+dF4YbSbQF8nSa7YL3KJyhMokkDrKIZRLfycaS3Hx78NhrYyZSuxSLruIVwO50ohksQ/L5LRKBvFL7VIFpHudSRuKIUdsPCUbY7OGTu5sDc9dVzkfgPx23ivWPmTW9H4k8oi5qVh/A+ZScxGU1RIFsibErdfsAmTmgsk0ehyyH/RJyyUzizumk+hugJ4NUznM2GEjuWQHP4B2WO+Uw==)

output sample(on SublimeText):

![sample-sublime-text](./images/sample-sublime-text.png)

## Features

- Enable [ESLint](https://eslint.org) in [Underscore.js](https://underscorejs.org/#template) and [Lodash](https://lodash.com/docs/#template)'s templates.
- You can find issues specific to template tags.
- Improves readability of HTML templates.
- For JavaScript (TypeScript) templates, enable [ESLint](https://eslint.org) both inside and outside the template tag. (_This is an experimental feature_)
- Partial supports for [EJS](https://ejs.co/).

## Installation

```bash
npm install --save-dev eslint eslint-plugin-lodash-template
```

## Documentation

See [documents](https://ota-meshi.github.io/eslint-plugin-lodash-template/).

## Usage

Create `eslint.config.*` file to configure rules. See also: [https://eslint.org/docs/latest/use/configure/configuration-files](https://eslint.org/docs/latest/use/configure/configuration-files).

Example **`eslint.config.*`**:

```js
import lodashTemplate from "eslint-plugin-lodash-template";
export default [
    {
        files: ["**/*.html"],
        ...lodashTemplate.configs.recommendedWithHtml,
    },
];
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

This plugin provides 7 predefined configs to use in `eslint.config.js`:

- `*.configs.base` - Settings and rules to enable correct ESLint parsing
- `*.configs.baseWithEjs` - Settings and rules to enable correct ESLint parsing for EJS
- `*.configs.bestPractices` - Above, plus rules to improve dev experience
- `*.configs.recommended` - Above, plus rules to improve code readability
- `*.configs.recommendedWithHtml` - Above, plus rules to improve code readability with HTML template
- `*.configs.recommendedWithScript` - `*.configs.recommended` config, plus to enable ESLint parsing of JavaScript templates (_This is an experimental feature_)
- `*.configs.all` - All rules of this plugin are included

## Rules

The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) automatically fixes problems reported by rules which have a wrench :wrench: below.

<!--RULES_TABLE_START-->

### Base Rules (Enabling Correct ESLint Parsing)

Enable this plugin using with:

```js
import lodashTemplate from "eslint-plugin-lodash-template";

export default [...lodashTemplate.configs.base];
```

|     | Rule ID                                                                            | Description                         |
| :-- | :--------------------------------------------------------------------------------- | :---------------------------------- |
|     | [lodash-template/no-script-parsing-error](./docs/rules/no-script-parsing-error.md) | disallow parsing errors in template |

### Best Practices (Improve Development Experience)

Enforce all the rules in this category with:

```js
import lodashTemplate from "eslint-plugin-lodash-template";

export default [...lodashTemplate.configs.bestPractices];
```

|          | Rule ID                                                                                                | Description                                                                                                                  |
| :------- | :----------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
|          | [lodash-template/no-empty-template-tag](./docs/rules/no-empty-template-tag.md)                         | disallow empty micro-template tag. (ex. :ng: `<% %>`)                                                                        |
|          | [lodash-template/no-invalid-template-interpolation](./docs/rules/no-invalid-template-interpolation.md) | disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)                              |
| :wrench: | [lodash-template/no-semi-in-template-interpolation](./docs/rules/no-semi-in-template-interpolation.md) | disallow the semicolon at the end of expression in micro template interpolation.(ex. :ok: `<%= text %>` :ng: `<%= text; %>`) |

### Recommended (Improve Readability)

Enforce all the rules in this category and all the rules in `Best Practices` categories with:

```js
import lodashTemplate from "eslint-plugin-lodash-template";
export default [
    lodashTemplate.configs.recommended,

    // If you want to lint HTML files, also set the following:
    {
        files: ["**/*.html"],
    },
];
```

|          | Rule ID                                                                                      | Description                                                                               |
| :------- | :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| :wrench: | [lodash-template/no-irregular-whitespace](./docs/rules/no-irregular-whitespace.md)           | disallow irregular whitespace outside the template tags.                                  |
| :wrench: | [lodash-template/no-multi-spaces-in-scriptlet](./docs/rules/no-multi-spaces-in-scriptlet.md) | disallow multiple spaces in scriptlet. (ex. :ng: `<% if···(test)···{ %>`)                 |
| :wrench: | [lodash-template/scriptlet-indent](./docs/rules/scriptlet-indent.md)                         | enforce consistent indentation to scriptlet in micro-template tag.                        |
| :wrench: | [lodash-template/template-tag-spacing](./docs/rules/template-tag-spacing.md)                 | enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`) |

### Recommended with HTML template (Improve Readability with HTML template)

Enforce all the rules in this category and all the rules in `Best Practices`/`Recommended` categories with:

```js
import lodashTemplate from "eslint-plugin-lodash-template";

export default [
    lodashTemplate.configs.recommendedWithHtml,

    // If you want to lint HTML files, also set the following:
    {
        files: ["**/*.html"],
    },
];
```

|          | Rule ID                                                                                        | Description                                                                                                            |
| :------- | :--------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| :wrench: | [lodash-template/attribute-name-casing](./docs/rules/attribute-name-casing.md)                 | enforce HTML attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`)                     |
| :wrench: | [lodash-template/attribute-value-quote](./docs/rules/attribute-value-quote.md)                 | enforce quotes style of HTML attributes. (ex. :ok: `<div class="abc">` :ng: `<div class='abc'>` `<div class=abc>`)     |
| :wrench: | [lodash-template/element-name-casing](./docs/rules/element-name-casing.md)                     | enforce HTML element name casing. (ex. :ok: `<xxx-element>` :ng: `<xxxElement>` `<DIV>`)                               |
| :wrench: | [lodash-template/html-closing-bracket-newline](./docs/rules/html-closing-bracket-newline.md)   | require or disallow a line break before tag's closing brackets                                                         |
| :wrench: | [lodash-template/html-closing-bracket-spacing](./docs/rules/html-closing-bracket-spacing.md)   | require or disallow a space before tag's closing brackets. (ex. :ok: `<input>` `<input·/>` :ng: `<input·>` `<input/>`) |
| :wrench: | [lodash-template/html-comment-content-newline](./docs/rules/html-comment-content-newline.md)   | require or disallow a line break before and after HTML comment contents                                                |
| :wrench: | [lodash-template/html-comment-spacing](./docs/rules/html-comment-spacing.md)                   | enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`)                          |
| :wrench: | [lodash-template/html-content-newline](./docs/rules/html-content-newline.md)                   | require or disallow a line break before and after HTML contents                                                        |
| :wrench: | [lodash-template/html-indent](./docs/rules/html-indent.md)                                     | enforce consistent HTML indentation.                                                                                   |
| :wrench: | [lodash-template/max-attributes-per-line](./docs/rules/max-attributes-per-line.md)             | enforce the maximum number of HTML attributes per line                                                                 |
|          | [lodash-template/no-duplicate-attributes](./docs/rules/no-duplicate-attributes.md)             | disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`)                                                    |
|          | [lodash-template/no-html-comments](./docs/rules/no-html-comments.md)                           | disallow HTML comments. (ex. :ng: `<!-- comment -->`)                                                                  |
| :wrench: | [lodash-template/no-multi-spaces-in-html-tag](./docs/rules/no-multi-spaces-in-html-tag.md)     | disallow multiple spaces in HTML tags. (ex. :ng: `<input···type="text">`)                                              |
| :wrench: | [lodash-template/no-space-attribute-equal-sign](./docs/rules/no-space-attribute-equal-sign.md) | disallow spacing around equal signs in attribute. (ex. :ok: `<div class="item">` :ng: `<div class = "item">`)          |
|          | [lodash-template/no-warning-html-comments](./docs/rules/no-warning-html-comments.md)           | disallow specified warning terms in HTML comments. (ex. :ng: `<!-- TODO:task -->`)                                     |

### Uncategorized

|     | Rule ID                                                                                                        | Description                                                                                          |
| :-- | :------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
|     | [lodash-template/no-template-tag-in-start-tag](./docs/rules/no-template-tag-in-start-tag.md)                   | disallow template tag in start tag outside attribute values. (ex. :ng: `<input <%= 'disabled' %> >`) |
|     | [lodash-template/prefer-escape-template-interpolations](./docs/rules/prefer-escape-template-interpolations.md) | prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`)              |

<!--RULES_TABLE_END-->

## Plugin Option

### Suppress `no-undef` warnings in the template tag

Please set the global variable used in all templates as follows.

**`eslint.config.*`**:

```js
import lodashTemplate from "eslint-plugin-lodash-template";
export default [
    {
        settings: {
            "lodash-template/globals": ["variableName"],
        },
    },
];
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

**`eslint.config.*`**:

```js
export default [
    {
        settings: {
            "lodash-template/ignoreRules": ["no-undef", "no-tabs"],
        },
    },
];
```

The ESLint standard suppression method can also be used by using template tag, as follows.

```diff
+ <% /* eslint no-ternary: 0 */ %>
```

### Customize parser

For example, if you set [Lodash `templateSettings`](https://lodash.com/docs/#templateSettings) as follows,

```js
_.templateSettings = {
    evaluate: /{{([\s\S]+?)}}/g,
    interpolate: /{{=([\s\S]+?)}}/g,
    escape: /{{-([\s\S]+?)}}/g,
};
```

please set `parserOptions` in your **`eslint.config.*`** as follows:

```js
export default [
    {
        languageOptions: {
            parserOptions: {
                templateSettings: {
                    evaluate: ["{{", "}}"],
                    interpolate: ["{{=", "}}"],
                    escape: ["{{-", "}}"],
                },
            },
        },
    },
];
```

For example, to parse like [EJS](https://ejs.co/), set as follows:

(Alternatively, you can use `lodashTemplate.configs.baseWithEjs`.)

```js
export default [
    {
        files: ["**/*.ejs"],
        languageOptions: {
            parserOptions: {
                templateSettings: {
                    evaluate: [
                        ["<%", "<%_"],
                        ["%>", "-%>", "_%>"],
                    ],
                    interpolate: ["<%-", ["%>", "-%>", "_%>"]],
                    escape: ["<%=", ["%>", "-%>", "_%>"]],
                    comment: ["<%#", ["%>", "-%>", "_%>"]],
                    literal: ["<%%"],
                },
            },
        },
    },
];
```

(This plugin do not provide complete support for [EJS](https://ejs.co/). e.g. the `include` directive.)

### Customize target extensions

Please configure in your **`eslint.config.*`** as follows:

(For example, for [EJS](https://ejs.co/).)

```js
import lodashTemplate from "eslint-plugin-lodash-template";
export default [
    {
        files: ["**/*.ejs"],
        processor: lodashTemplate.processors.html,
    },
];
```

### For JavaScript (TypeScript) Templates

(_This is an experimental feature_. Also check for [known limitations](#known-limitations-in-script-templates).)

For example if you have a file like below.

```js
/* eslint no-multi-spaces: error */
<% /* eslint lodash-template/no-multi-spaces-in-scriptlet: error */ %>

// if this plugin is not used, a parsing error will occur.
const obj    = <%= JSON.stringify(options     ) %>
//       ^^^^                            ^^^^^
//         |                              |
//         |          If you don't use lodashTemplate.configs.recommendedWithScript,
//         |          only the space after `options` is reported.
//         |
//         + When using lodashTemplate.configs.recommendedWithScript, the space after `obj` is also reported.
```

[**_Playground on the Web_**](https://eslint-online-playground.netlify.app/#eNqdU8tu2zAQ/JUFAcOta0l3ISl66KHNoTkkaA5hAjPSyqZLkQJJNTES/3uWFBM/YBtBaMB67MzOcjh6Zs5WBT6JtlOYLx0rWTEBdEpqD9pkba+8zFwnKnQloLXGwqTg+mwEG5wytXCLzCM1ER6LPV4mdeYqKzuv0G+awOg711wXBcgG/EI66FQ/lxroThsPvcN6CgI6YZ3U88R7lEqBqare5lxXRjsP5mEJtM7hbHQOF1eXf3LnLTFks/piOi8JFOrwNSqS3rDuaaXbgyvU72GLAPByCk/lY+DfDaxMD7XR47gvmHE2bLbc985iZdoWdY119ij9IjnH2Wx6rLvRakUGIkS7QTQeLczSzmfBToudsR5rsmy7xc7TN7hZoKbpgtefmu/ADA/LqC+UM9tDsCkbopPTCTZynrcxebINiJSqCweNNS2MfwzPxdKNuU6QYarrNFQCDrhsGDzbG5y4XONTZNfYCMon3NI7/6aWRnH51g7Jcu53tQ7BbsiHX75VAU6E5/BHPKHnvZjj5XAQJaT3JFm14i9Sqo0ugbPQ1pGDUS38nOlthderDkO5NXWvkLOhug6X9a5SI1X4Om85m0yKSb6gUTi7i+1OI3Hp3oDcd9bQx+qMLffszd8rLvb+QOOP9T1i5VVM1LvKXcwLxeofmUmdjaaokCyQNzX+/4ldYOpKIolGl0OceUpYeLVj8VDchOoI4GSYdjmBQseyZutXHHXISQ==)

#### Configuring

Please configure in your **`eslint.config.*`** as follows:

```js
import lodashTemplate from "eslint-plugin-lodash-template";
export default [
    {
        files: ["**/your/templates/*.js"],
        ...lodashTemplate.configs.recommendedWithScript,
    },
];
```

If you do not want to use the included rules, set the details as follows:

```js
import lodashTemplate from "eslint-plugin-lodash-template";
export default [
    {
        files: ["**/your/templates/*.js"],
        ...lodashTemplate.configs.base,
        processor: lodashTemplate.processors.script,
        rules: {
            "lodash-template/no-invalid-template-interpolation": "error",
            // other rules...
        },
    },
];
```

If you want to use it with TypeScript, you need to configure `parserOptions`:

```js
import lodashTemplate from "eslint-plugin-lodash-template";
import tseslint from "typescript-eslint";

export default [
    {
        files: ["**/your/templates/*.ts"],
        ...lodashTemplate.configs.recommendedWithScript,
    },
    {
        files: ["**/your/templates/*.ts"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                sourceType: "module",
            },
        },
    },
];
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
const a = "foo";

const b = 1;
```

Generated Script 2:

```js
const a = "foo";

const b = 2;
```

If we use the following script, it is a parsing error.

```js
const a = "foo";

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
const a = "x.foo is true";

// ...

console.log(a);
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
const a = "x.foo is true";

// ...

console.log(a);
```

Generated Script 2:

```js
const a = "x.foo is true";

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
        "eslint.validate": ["javascript", "javascriptreact", "html"]
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
