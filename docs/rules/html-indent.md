---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/html-indent"
description: "enforce consistent HTML indentation."
---

# lodash-template/html-indent

> enforce consistent HTML indentation.

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a consistent HTML indentation style. The default style is 2 spaces.

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/html-indent": "error" */ %>
<!-- ✓ GOOD -->
<div>
  <div class="foo">
    Hello.
  </div>
</div>

<!-- ✗ BAD -->
<div>
 <div class="foo">
   Hello.
    </div>
</div>
```

## Options

```js
{
  "lodash-template/html-indent": ["error", type, {
    "attribute": 1,
    "closeBracket": 0
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `attribute` (`integer`) ... The multiplier of indentation for attributes. Default is `1`.
- `closeBracket` (`integer`) ... The multiplier of indentation for right brackets. Default is `0`.

### Examples for this rule with `{ attribute: 1, closeBracket: 1 }` option:

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/html-indent": ["error", 2, { "attribute": 1, "closeBracket": 1 }] */ %>
<!-- ✓ GOOD -->
<div>
  <div
    id="a"
    class="b"
    attr1="c"
    attr2="d"
    >
    Text
  </div>
</div>
```

### Examples for this rule with `{ attribute: 2, closeBracket: 1 }` option:

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/html-indent": ["error", 2, { "attribute": 2, "closeBracket": 1 }] */ %>
<!-- ✓ GOOD -->
<div>
  <div
      id="a"
      class="b"
      attr1="c"
      attr2="d"
    >
    Text
  </div>
</div>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/html-indent.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/html-indent.js)
