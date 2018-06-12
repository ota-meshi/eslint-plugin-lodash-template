# enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`) (lodash-template/template-tag-spacing)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to enforce unified spacing in micro-template interpolate/evaluate.

:-1: Examples of **incorrect** code for this rule:

```html
<div><%=   text   %></div>
<div><%=text%></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div><%= text %></div>
```

## Options

Default spacing is set to `always`


```json
{
  "lodash-template/micro-template-interpolation-spacing": ["error", "always"|"never"]
}
```

### `"always"` - Expect one space between expression and curly brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<div><%=   text   %></div>
<div><%=text%></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div><%= text %></div>
```

### `"never"` - Expect no spaces between expression and curly brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<div><%= text %></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div><%=text %></div>
```
