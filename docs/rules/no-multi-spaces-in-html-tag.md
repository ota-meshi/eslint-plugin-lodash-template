---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-multi-spaces-in-html-tag"
description: "disallow multiple spaces in HTML tags. (ex. :ng: `<input···type=\"text\">`)"
---
# lodash-template/no-multi-spaces-in-html-tag
> disallow multiple spaces in HTML tags. (ex. :ng: `<input···type="text">`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to disallow multiple whitespace in a between attributes which are not used for indentation.

<eslint-code-block fix :rules="{'lodash-template/no-multi-spaces-in-html-tag': ['error']}">

```html
<!-- ✓ GOOD -->
<input
  class="foo"
  type="text"
>

<input class="foo" type="text">

<!-- ✗ BAD -->
<input     class="foo"
      type="text"         >
```

</eslint-code-block>

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-multi-spaces-in-html-tag.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-multi-spaces-in-html-tag.js)
