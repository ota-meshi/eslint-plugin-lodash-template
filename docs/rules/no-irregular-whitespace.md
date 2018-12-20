---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-irregular-whitespace"
description: "disallow irregular whitespace outside the template tags."
---
# lodash-template/no-irregular-whitespace
> disallow irregular whitespace outside the template tags.

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule disallows the irregular whitespaces.

<eslint-code-block fix :rules="{'lodash-template/no-irregular-whitespace': ['error']}">

```html
<!-- ✓ GOOD -->
<div id="item-id" class="item-content">
</div >

<!-- ✗ BAD -->
<div　id="item-id"　class="item-content">
</div　>
```

</eslint-code-block>

## Options

```json
{
  "lodash-template/no-irregular-whitespace": ["error", {
    "skipComments": false,
    "skipAttrValues": false,
    "skipText": false
  }]
}
```

This rule has an object option for exceptions:

* `"skipComments": true` allows any whitespace characters in HTML comments
* `"skipAttrValues": true` allows any whitespace characters in HTML attribute values
* `"skipText": true` allows any whitespace characters in HTML texts

## Further Reading

* [ESLint `no-irregular-whitespace` rule](https://eslint.org/docs/rules/no-irregular-whitespace)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-irregular-whitespace.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-irregular-whitespace.js)
