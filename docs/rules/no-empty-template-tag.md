# disallow empty micro-template tag. (ex. :ng: `<% %>`) (lodash-template/no-empty-template-tag)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.

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
