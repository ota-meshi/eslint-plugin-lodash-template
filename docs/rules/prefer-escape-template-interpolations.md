# prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`) (lodash-template/prefer-escape-template-interpolations)

- :gear: This rule is included in `"plugin:lodash-template/all"`.

## Rule Details

This rule reports no escape micro-template interpolates.

:-1: Examples of **incorrect** code for this rule:

```html
<div><%= text %></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div><%- text %></div>
<div><% print(html) %></div>
```
