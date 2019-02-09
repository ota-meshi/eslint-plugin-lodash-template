---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/html-content-newline"
description: "require or disallow a line break before and after HTML contents"
---
# lodash-template/html-content-newline
> require or disallow a line break before and after HTML contents

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a line break (or no line break) before and after HTML contents.

<eslint-code-block fix :rules="{'lodash-template/html-content-newline': ['error']}">

```html
<!-- ✓ GOOD -->
<div class="panel">content</div>

<div class="panel">
  content
</div>

<div
  class="panel"
>
  content
</div>

<!-- ✗ BAD -->
<div
  class="panel"
>content</div>
```

</eslint-code-block>

## Options

```json
{
  "lodash-template/html-content-newline": ["error", {
    "singleline": "ignore",
    "multiline": "always",
    "ignoreNames": ["pre", "textarea"]
  }]
}
```

- `singleline` ... the configuration for single-line elements. It's a single-line element if startTag, endTag and contents are single-line.
    - `"ignore"` ... Don't enforce line breaks style before and after the contents. This is the default.
    - `"never"` ... disallow line breaks before and after the contents.
    - `"always"` ... require one line break before and after the contents.
- `multiline` ... the configuration for multiline elements. It's a multiline element if startTag, endTag or contents are multiline.
    - `"ignore"` ... Don't enforce line breaks style before and after the contents.
    - `"never"` ... disallow line breaks before and after the contents.
    - `"always"` ... require one line break before and after the contents. This is the default.
- `ignoreNames` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`

<eslint-code-block fix :rules="{}">

```html
<% /*eslint
  lodash-template/html-content-newline: ["error", {
    "singleline": "always",
    "multiline": "never"
  }]
*/ %>

<!-- ✓ GOOD -->
<div class="panel">
  content
</div>

<div
  class="panel"
>content</div>

<!-- ✗ BAD -->
<div class="panel">content</div>

<div
  class="panel"
>
  content
</div>
```

</eslint-code-block>

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/html-content-newline.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/html-content-newline.js)
