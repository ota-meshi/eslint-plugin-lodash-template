---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-invalid-template-interpolation"
description: "disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)"
---

# lodash-template/no-invalid-template-interpolation

> disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"`, `"plugin:lodash-template/recommended-with-script"` and `"plugin:lodash-template/all"`.

## Rule Details

This rule disallow other than expression in micro-template interpolation.

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/no-invalid-template-interpolation": "error" */ %>
<!-- ✓ GOOD -->
<% if (a) { %>
  <div></div>
<% } %>

<div><%= text %></div>

<!-- ✗ BAD -->
<%= if (a) { %>
  <div></div>
<% } %>

<div><%= /**/ %></div>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-invalid-template-interpolation.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-invalid-template-interpolation.js)
