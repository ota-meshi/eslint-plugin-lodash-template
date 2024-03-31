---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-duplicate-attributes"
description: "disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`)"
---
# lodash-template/no-duplicate-attributes
> disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.

## Rule Details

This rule reports duplicate attributes.

When duplicate arguments exist, only the last one is valid.
It's possibly mistakes.

```html
<% /* eslint "lodash-template/no-duplicate-attributes": "error" */ %>
<!-- ✓ GOOD -->
<div
  foo="abc"
></div>

<!-- ✗ BAD -->
<div
  foo="abc"
  foo="def"
></div>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-duplicate-attributes.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-duplicate-attributes.js)
