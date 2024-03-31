---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/html-comment-spacing"
description: "enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`)"
---
# lodash-template/html-comment-spacing
> enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to enforce unified spacing in HTML comment.

```html
<% /* eslint "lodash-template/html-comment-spacing": "error" */ %>
<!-- ✓ GOOD -->
<!-- comment -->

<!-- ✗ BAD -->
<!--   comment   -->
<!--comment-->
```

## Options

Default spacing is set to `always`

```json
{
  "lodash-template/html-comment-spacing": ["error", "always" | "never"]
}
```

### `"always"` - Expect one space between comment and curly brackets.

```html
<% /* eslint "lodash-template/html-comment-spacing": ["error", "always"] */ %>
<!-- ✓ GOOD -->
<!-- comment -->

<!-- ✗ BAD -->
<!--   comment   -->
<!--comment-->
```

### `"never"` - Expect no spaces between comment and curly brackets.

```html
<% /* eslint "lodash-template/html-comment-spacing": ["error", "never"] */ %>
<!--✓ GOOD-->
<!--comment-->

<!-- ✗ BAD -->
<!-- comment -->
```

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/html-comment-spacing.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/html-comment-spacing.js)
