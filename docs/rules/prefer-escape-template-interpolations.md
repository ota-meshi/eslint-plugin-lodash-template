---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/prefer-escape-template-interpolations"
description: "prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`)"
---
# lodash-template/prefer-escape-template-interpolations
> prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`)

- :gear: This rule is included in `"plugin:lodash-template/all"`.

## Rule Details

This rule reports no escape micro-template interpolates.

```html
<% /* eslint "lodash-template/prefer-escape-template-interpolations": "error" */ %>
<!-- ✓ GOOD -->
<div><%- text %></div>
<div><% print(html) %></div>

<!-- ✗ BAD -->
<div><%= text %></div>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/prefer-escape-template-interpolations.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/prefer-escape-template-interpolations.js)
