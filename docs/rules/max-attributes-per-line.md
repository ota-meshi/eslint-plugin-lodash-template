---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/max-attributes-per-line"
description: "enforce the maximum number of HTML attributes per line"
---

# lodash-template/max-attributes-per-line

> enforce the maximum number of HTML attributes per line

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

Limits the maximum number of attributes/properties per line to improve readability.

This rule aims to enforce a number of attributes per line in HTML.
It checks all the elements and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/max-attributes-per-line": "error" */ %>
<!-- ✓ GOOD -->
<input foo="1">

<input
  foo="1"
  bar="2"
>

<input
  foo="1"
  bar="2"
  baz="3"
>

<!-- ✗ BAD -->
<input foo="1" bar="2">

<input
  foo="1" bar="2"
>

<input
  foo="1" bar="2"
  baz="3"
>
```

## Options

```js
{
  "lodash-template/max-attributes-per-line": ["error", {
    "singleline": 1,
    "multiline": {
      "max": 1,
      "allowFirstLine": false
    }
  }]
}
```

### `allowFirstLine`

For multi-line declarations, defines if allows attributes to be put in the first line. (Default false)

<!-- prettier-ignore -->
```html
<% /* eslint
  lodash-template/max-attributes-per-line: ["error", {
    "multiline": {
      "allowFirstLine": false
    }
  }]
*/ %>

<!-- ✓ GOOD -->
<input
  foo="1"
  bar="2"
>

<!-- ✗ BAD -->
<input foo="1"
  bar="2"
>
```

### `singleline`

Number of maximum attributes per line when the opening tag is in a single line. (Default is 1)

<!-- prettier-ignore -->
```html
<% /* eslint
  lodash-template/max-attributes-per-line: ["error", {
    "singleline": 1
  }]
*/ %>

<!-- ✓ GOOD -->
<input foo="1">

<!-- ✗ BAD -->
<input foo="1" bar="2">
```

### `multiline`

Number of maximum attributes per line when a tag is in multiple lines. (Default is 1)

<!-- prettier-ignore -->
```html
<% /* eslint
  lodash-template/max-attributes-per-line: ["error", {
    "multiline": 1
  }]
*/ %>

<!-- ✓ GOOD -->
<input
  foo="1"
  bar="2"
>

<!-- ✗ BAD -->
<input
  foo="1" bar="2"
>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/max-attributes-per-line.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/max-attributes-per-line.js)
