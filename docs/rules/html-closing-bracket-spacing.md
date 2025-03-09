---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/html-closing-bracket-spacing"
description: "require or disallow a space before tag's closing brackets. (ex. :ok: `<input>` `<input·/>` :ng: `<input·>` `<input/>`)"
---

# lodash-template/html-closing-bracket-spacing

> require or disallow a space before tag's closing brackets. (ex. :ok: `<input>` `<input·/>` :ng: `<input·>` `<input/>`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces consistent spacing style before closing brackets `>` of tags.

<!-- prettier-ignore -->
```html
<div class="foo"> or <div class="foo" >
<input class="foo"/> or <input class="foo" />
```

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/html-closing-bracket-spacing": "error" */ %>
<!-- ✓ GOOD -->
<input>
<input foo>
<div foo="bar">
</div>
<br />
<input foo />
<input foo="bar" />

<!-- ✗ BAD -->
<input >
<input foo >
<div foo="bar" >
</div >
<br/>
<input foo/>
<input foo="bar"/>
```

## Options

```js
{
  "lodash-template/html-closing-bracket-spacing": ["error", {
    "startTag": "always" | "never",
    "endTag": "always" | "never",
    "selfClosingTag": "always" | "never"
  }]
}
```

- `startTag` (`"always" | "never"`) ... Setting for the `>` of start tags (e.g. `<div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `endTag` (`"always" | "never"`) ... Setting for the `>` of end tags (e.g. `</div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `selfClosingTag` (`"always" | "never"`) ... Setting for the `/>` of self-closing tags (e.g. `<br/>`). Default is `"always"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.

<!-- prettier-ignore -->
```html
<% /* eslint
  lodash-template/html-closing-bracket-spacing: ["error", {
    "startTag": "always",
    "endTag": "always",
    "selfClosingTag": "always"
  }]
*/ %>
<!-- ✓ GOOD -->
<input >
<input foo >
<div foo="bar" >
</div >
<br />
<input foo />
<input foo="bar" />
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/html-closing-bracket-spacing.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/html-closing-bracket-spacing.js)
