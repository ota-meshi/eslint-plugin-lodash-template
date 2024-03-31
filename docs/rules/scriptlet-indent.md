---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/scriptlet-indent"
description: "enforce consistent indentation to scriptlet in micro-template tag."
---
# lodash-template/scriptlet-indent
> enforce consistent indentation to scriptlet in micro-template tag.

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"`, `"plugin:lodash-template/recommended-with-script"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a consistent indentation style to script in micro-template tag. The default style is 2 spaces.

```html
<% /* eslint "lodash-template/scriptlet-indent": "error" */ %>
<!-- ✓ GOOD -->
<% for (
    let i = 0;
    i < arr.length;
    i++
  ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>

<!-- ✗ BAD -->
<% for (
      let i = 0;
    i < arr.length;
  i++
    ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

## Options

```json
{
  "lodash-template/scriptlet-indent": ["error", type, {
    "startIndent": 1,
    "switchCase": 0
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `startIndent` (`integer`) ... The multiplier of indentation for top-level statements in micro-template tag. Default is `1`.
- `switchCase` (`integer`) ... The multiplier of indentation for `case`/`default` clauses. Default is `0`.

### Examples for this rule with `{startIndent: 0}`:

```html
<% /* eslint "lodash-template/scriptlet-indent": ["error", 2, {"startIndent": 0}] */ %>
<!-- ✓ GOOD -->
<% for (
  let i = 0;
  i < arr.length;
  i++
) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

### Examples for this rule with `{startIndent: 2}`:

```html
<% /* eslint "lodash-template/scriptlet-indent": ["error", 2, {"startIndent": 2}] */ %>
<!-- ✓ GOOD -->
<% for (
      let i = 0;
      i < arr.length;
      i++
    ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/scriptlet-indent.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/scriptlet-indent.js)
