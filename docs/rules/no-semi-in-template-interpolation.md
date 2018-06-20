# disallow the semicolon at the end of expression in micro template interpolation.(ex. :ok: `<%= text %>` :ng: `<%= text; %>`) (lodash-template/no-semi-in-template-interpolation)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule disallow the semicolon at the end of expression in micro template interpolation.

:-1: Examples of **incorrect** code for this rule:

```html
<%= text; %>
```

:+1: Examples of **correct** code for this rule:

```html
<%= text %>
```