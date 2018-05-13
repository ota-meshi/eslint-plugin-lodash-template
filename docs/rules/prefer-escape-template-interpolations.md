# prefer escape micro-template interpolations. (ex. :+1: `<%- ... %>`, :-1: `<%= ... %>`) (lodash-template/prefer-escape-template-interpolations)

## Rule Details

This rule reports no escape micro-template interpolates.

:-1: Examples of **incorrect** code for this rule:

```html
<div><%= text %></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div><%- text %></div>
```
