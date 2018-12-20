---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-template-tag-in-start-tag"
description: "disallow template tag in start tag outside attribute values. (ex. :ng: `<input <%= 'disabled' %> >`)"
---
# lodash-template/no-template-tag-in-start-tag
> disallow template tag in start tag outside attribute values. (ex. :ng: `<input <%= 'disabled' %> >`)

- :gear: This rule is included in `"plugin:lodash-template/all"`.

## Rule Details

This rule reports the template tag that is in the start tag, outside attribute values.

<eslint-code-block :rules="{'lodash-template/no-template-tag-in-start-tag': ['error']}">

```html
<!-- ✓ GOOD -->
<input disabled >

<input class="<%= hidden ? 'hidden' : '' %>" >

<!-- ✗ BAD -->
<input <%= 'disabled' %> >

<input <%= disabled ? 'disabled' : '' %> >

<input
  <% if (disabled) { %>
  disabled
  <% } %>
>
```

</eslint-code-block>

## Options

```json
{
  "lodash-template/no-template-tag-in-start-tag": ["error", {
    "arrowEvaluateTag": false,
  }]
}
```

### Examples for this rule with `{arrowEvaluateTag: true}` option:

<eslint-code-block :rules="{'lodash-template/no-template-tag-in-start-tag': ['error', {arrowEvaluateTag: true}]}">

```html
<!-- ✓ GOOD -->
<input disabled >
<input
  <% if (disabled) { %>
  disabled
  <% } %>
>
```

</eslint-code-block>

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-template-tag-in-start-tag.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-template-tag-in-start-tag.js)
