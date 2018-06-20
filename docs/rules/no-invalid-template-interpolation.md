# disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`) (lodash-template/no-invalid-template-interpolation)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.

## Rule Details

This rule disallow other than expression in micro-template interpolation.

:-1: Examples of **incorrect** code for this rule:

```html
<%= if (a) { %>
  <div></div>
<% } %>
```

```html
<div><%= /**/ %></div>
```

:+1: Examples of **correct** code for this rule:

```html
<% if (a) { %>
  <div></div>
<% } %>
```

```html
<div><%= text %></div>
```
