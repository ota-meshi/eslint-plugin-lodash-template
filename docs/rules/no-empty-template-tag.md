# disallow empty micro-template interpolation/evaluate(s). (ex. `<% %>`) (lodash-template/no-empty-template-tag)

- :gear: This rule is included in `"plugin:lodash-template/best-practices"` and `"plugin:lodash-template/recommended"`.

## Rule Details

This rule reports empty micro-template interpolate/evaluate.

:-1: Examples of **incorrect** code for this rule:

```html
<div><% %></div>
<div><%
%></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div><%= text %></div>
```
