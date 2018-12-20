---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/template-tag-spacing"
description: "enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`)"
---
# lodash-template/template-tag-spacing
> enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to enforce unified spacing in micro-template interpolate/evaluate.

<eslint-code-block fix :rules="{'lodash-template/template-tag-spacing': ['error']}">

```html
<!-- ✓ GOOD -->
<div><%= text %></div>

<!-- ✗ BAD -->
<div><%=   text   %></div>
<div><%=text%></div>
```

</eslint-code-block>

## Options

Default spacing is set to `always`


```json
{
  "lodash-template/micro-template-interpolation-spacing": ["error", "always" | "never"]
}
```

### `"always"` - Expect one space between expression and curly brackets.

<eslint-code-block fix :rules="{'lodash-template/template-tag-spacing': ['error', 'always']}">

```html
<!-- ✓ GOOD -->
<div><%= text %></div>

<!-- ✗ BAD -->
<div><%=   text   %></div>
<div><%=text%></div>
```

</eslint-code-block>

### `"never"` - Expect no spaces between expression and curly brackets.

<eslint-code-block fix :rules="{'lodash-template/template-tag-spacing': ['error', 'never']}">

```html
<!-- ✓ GOOD -->
<div><%=text%></div>

<!-- ✗ BAD -->
<div><%=   text   %></div>
<div><%= text %></div>
```

</eslint-code-block>

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/template-tag-spacing.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/template-tag-spacing.js)
