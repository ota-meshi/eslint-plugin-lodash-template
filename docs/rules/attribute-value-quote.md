---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/attribute-value-quote"
description: "enforce quotes style of HTML attributes. (ex. :ok: `<div class=\"abc\">` :ng: `<div class='abc'>` `<div class=abc>`)"
---
# lodash-template/attribute-value-quote
> enforce quotes style of HTML attributes. (ex. :ok: `<div class="abc">` :ng: `<div class='abc'>` `<div class=abc>`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces the quotes style of HTML attributes.

```html
<% /* eslint "lodash-template/attribute-value-quote": "error" */ %>
<!-- ✓ GOOD -->
<img src="./logo.png">

<!-- ✗ BAD -->
<img src='./logo.png'>
<img src=./logo.png>
```

## Options

```json
{
  "lodash-template/attribute-value-quote": ["error", "double" | "single" | "either" | "prefer-double"]
}
```

- `"double"` ... requires double quotes.
- `"single"` ... requires single quotes.
- `"either"` ... requires double quotes or single quotes.
- `"prefer-double"` (default) ... requires double quotes or single quotes. if do not need escape double quotes, requires double quotes.

### Examples for this rule with `"single"` option:

```html
<% /* eslint "lodash-template/attribute-value-quote": ["error", "single"] */ %>
<!-- ✓ GOOD -->
<img src='./logo.png'>

<!-- ✗ BAD -->
<img src="./logo.png">
<img src=./logo.png>
```

### Examples for this rule with `"either"` option:

```html
<% /* eslint "lodash-template/attribute-value-quote": ["error", "either"] */ %>
<!-- ✓ GOOD -->
<img src="./logo.png">
<img src='./logo.png'>

<!-- ✗ BAD -->
<img src=./logo.png>
```

## Further Reading

- [Google HTML/CSS Style Guide *HTML Quotation Marks*](https://google.github.io/styleguide/htmlcssguide.html#HTML_Quotation_Marks)
- [HTML5 Style Guide - W3Schools *Quote Attribute Values*](https://www.w3schools.com/html/html5_syntax.asp)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/attribute-value-quote.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/attribute-value-quote.js)
