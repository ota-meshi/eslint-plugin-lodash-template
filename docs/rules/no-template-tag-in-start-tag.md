# disallow template tag in start tag outside attribute values. (ex. :ng: `<input <%= 'disabled' %> >`) (lodash-template/no-template-tag-in-start-tag)

- :gear: This rule is included in `"plugin:lodash-template/all"`.

## Rule Details

This rule reports the template tag that is in the start tag, outside attribute values.

:-1: Examples of **incorrect** code for this rule:

```html
<input <%= 'disabled' %> >

<input <%= disabled ? 'disabled' : '' %> >

<input
  <% if (disabled) { %>
  disabled
  <% } %>
>
```

:+1: Examples of **correct** code for this rule:

```html
<input disabled >

<input class="<%= hidden ? 'hidden' : '' %>" >
```


### Options

```json
{
  "lodash-template/no-template-tag-in-start-tag": ["error", {
    "arrowEvaluateTag": false,
  }]
}
```

:+1: Examples of **correct** code  for `{arrowEvaluateTag: true}`:

```html
<input
  <% if (disabled) { %>
  disabled
  <% } %>
>
```
