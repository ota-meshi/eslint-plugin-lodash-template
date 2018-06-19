# disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`) (lodash-template/no-invalid-template-interpolation)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This disallow other than expression in micro-template interpolation.

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

## Options

```json
{
  "lodash-template/no-invalid-template-interpolation": ["error", {
    "allowSemi": false
  }]
}
```

#### `allowSemi`

Defines if allow semicolon can be set last of the script. (Default false)

:+1: Examples of **correct** code for `{ "allowSemi": true }`:

```html
<% /*eslint lodash-template/no-invalid-template-interpolation: ["error", { allowSemi: true }]*/ %>

<div><%= text; %></div>
```

:-1: Examples of **incorrect** code for `{ "allowSemi": true }`:

```html
<% /*eslint lodash-template/no-invalid-template-interpolation: ["error", { allowSemi: true }]*/ %>

<div><%= text;; %></div>
```
