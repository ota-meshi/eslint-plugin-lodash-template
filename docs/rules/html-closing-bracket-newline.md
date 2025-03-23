---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/html-closing-bracket-newline"
description: "require or disallow a line break before tag's closing brackets"
---

# lodash-template/html-closing-bracket-newline

> require or disallow a line break before tag's closing brackets

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

People have own preference about the location of closing brackets.
This rule enforces a line break (or no line break) before tag's closing brackets.

<!-- prettier-ignore -->
```html
<div
  id="foo"
  class="bar"> <!-- On the same line with the last attribute. -->
</div>
<div
  id="foo"
  class="bar"
> <!-- On the next line. -->
</div>
```

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/html-closing-bracket-newline": "error" */ %>
<!-- ✓ GOOD -->
<div id="foo" class="bar"></div>
<div
  id="foo"
  class="bar"></div>

<!-- ✗ BAD -->
<div id="foo" class="bar"
></div>
<div
  id="foo"
  class="bar"
></div>
<div
  id="foo"
  class="bar"
  ></div>
```

## Options

```js
{
    "lodash-template/html-closing-bracket-newline": [
        "error",
        {
            "singleline": "never",
            "multiline": "never"
        }
    ]
}
```

- `singleline` ... the configuration for single-line elements. It's a single-line element if the element does not have attributes or the last attribute is on the same line as the opening bracket.
    - `"never"` ... disallow line breaks before the closing bracket. This is the default.
    - `"always"` ... require one line break before the closing bracket.
- `multiline` ... the configuration for multiline elements. It's a multiline element if the last attribute is not on the same line of the opening bracket.
    - `"never"` ... disallow line breaks before the closing bracket. This is the default.
    - `"always"` ... require one line break before the closing bracket.

Plus, you can use [`lodash-template/html-indent`](./html-indent.md) rule to enforce indent-level of the closing brackets.

### Examples for this rule with `{ "multiline": "always" }` option:

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/html-closing-bracket-newline": ["error", { "multiline": "always" }] */ %>
<!-- ✓ GOOD -->
<div id="foo" class="bar"></div>
<div
  id="foo"
  class="bar"
></div>
<div
  id="foo"
  class="bar"
  ></div>

<!-- ✗ BAD -->
<div id="foo" class="bar"
></div>
<div
  id="foo"
  class="bar"></div>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/html-closing-bracket-newline.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/html-closing-bracket-newline.js)
