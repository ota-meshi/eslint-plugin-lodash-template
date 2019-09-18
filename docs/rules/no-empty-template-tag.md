---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-empty-template-tag"
description: "disallow empty micro-template tag. (ex. :ng: `<% %>`)"
---
# lodash-template/no-empty-template-tag
> disallow empty micro-template tag. (ex. :ng: `<% %>`)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"`, `"plugin:lodash-template/recommended-with-js"` and `"plugin:lodash-template/all"`.

## Rule Details

This rule reports empty micro-template interpolate/evaluate.

<eslint-code-block :rules="{'lodash-template/no-empty-template-tag': ['error']}">

```html
<!-- ✓ GOOD -->
<div><%= text %></div>

<!-- ✗ BAD -->
<div><% %></div>
<div><%
%></div>
```

</eslint-code-block>

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-empty-template-tag.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-empty-template-tag.js)
