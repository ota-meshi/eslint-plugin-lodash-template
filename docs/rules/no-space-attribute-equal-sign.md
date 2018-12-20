---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-space-attribute-equal-sign"
description: "disallow spacing around equal signs in attribute. (ex. :ok: `<div class=\"item\">` :ng: `<div class = \"item\">`)"
---
# lodash-template/no-space-attribute-equal-sign
> disallow spacing around equal signs in attribute. (ex. :ok: `<div class="item">` :ng: `<div class = "item">`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule disallow spacing around equal signs in attribute.

HTML5 allows spaces around equal signs. But space-less is easier to read, and groups entities better together.

<eslint-code-block fix :rules="{'lodash-template/no-space-attribute-equal-sign': ['error']}">

```html
<!-- ✓ GOOD -->
<input class="item">

<!-- ✗ BAD -->
<input class = "item">
```

</eslint-code-block>

## Further Reading

* [HTML5 Style Guide - W3Schools *Spaces and Equal Signs*](https://www.w3schools.com/html/html5_syntax.asp)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-space-attribute-equal-sign.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-space-attribute-equal-sign.js)
