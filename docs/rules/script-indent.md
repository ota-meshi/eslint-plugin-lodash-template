---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/script-indent"
description: "enforce consistent indentation to script in micro-template tag."
---
# lodash-template/script-indent
> enforce consistent indentation to script in micro-template tag.

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a consistent indentation style to script in micro-template tag. The default style is 2 spaces.

<eslint-code-block fix :rules="{'lodash-template/script-indent': ['error']}">

```html
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

</eslint-code-block>

## Options

```json
{
  "lodash-template/script-indent": ["error", type, {
    "startIndent": 1,
    "switchCase": 0
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `startIndent` (`integer`) ... The multiplier of indentation for top-level statements in micro-template tag. Default is `1`.
- `switchCase` (`integer`) ... The multiplier of indentation for `case`/`default` clauses. Default is `0`.

### Examples for this rule with `{startIndent: 0}`:

<eslint-code-block fix :rules="{'lodash-template/script-indent': ['error', 2, {startIndent: 0}]}">

```html
<!-- ✓ GOOD -->
<% for (
  let i = 0;
  i < arr.length;
  i++
) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

</eslint-code-block>

### Examples for this rule with `{startIndent: 2}`:

<eslint-code-block fix :rules="{'lodash-template/script-indent': ['error', 2, {startIndent: 2}]}">

```html
<!-- ✓ GOOD -->
<% for (
      let i = 0;
      i < arr.length;
      i++
    ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

</eslint-code-block>

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/script-indent.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/script-indent.js)
