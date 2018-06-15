# disallow spacing around equal signs in attribute. (ex. :ok: `<div class="item">` :ng: `<div class = "item">`) (lodash-template/no-space-attribute-equal-sign)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule disallow spacing around equal signs in attribute.

HTML5 allows spaces around equal signs. But space-less is easier to read, and groups entities better together.

:-1: Examples of **incorrect** code for this rule:

```html
<div class = "item">
```

:+1: Examples of **correct** code for this rule:

```html
<div class="item">
```
