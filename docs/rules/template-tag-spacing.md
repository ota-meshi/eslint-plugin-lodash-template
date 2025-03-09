---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/template-tag-spacing"
description: "enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`)"
---

# lodash-template/template-tag-spacing

> enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"`, `"plugin:lodash-template/recommended-with-script"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to enforce unified spacing in micro-template interpolate/evaluate.

```html
<% /* eslint "lodash-template/template-tag-spacing": "error" */ %>
<!-- ✓ GOOD -->
<div><%= text %></div>

<!-- ✗ BAD -->
<div><%= text %></div>
<div><%=text%></div>
```

## Options

Default spacing is set to `always`

```js
{
  "lodash-template/micro-template-interpolation-spacing": ["error", "always" | "never"]
}
```

### `"always"` - Expect one space between expression and curly brackets.

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/template-tag-spacing": ["error", "always"] */ %>
<!-- ✓ GOOD -->
<div><%= text %></div>

<!-- ✗ BAD -->
<div><%=   text   %></div>
<div><%=text%></div>
```

### `"never"` - Expect no spaces between expression and curly brackets.

<!-- prettier-ignore -->
```html
<%/* eslint "lodash-template/template-tag-spacing": ["error", "never"] */%>
<!-- ✓ GOOD -->
<div><%=text%></div>

<!-- ✗ BAD -->
<div><%=   text   %></div>
<div><%= text %></div>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/template-tag-spacing.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/template-tag-spacing.js)
