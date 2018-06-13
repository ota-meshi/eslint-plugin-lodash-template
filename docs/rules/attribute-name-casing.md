# enforce attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`) (lodash-template/attribute-name-casing)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces attribute name casing style (kebab-case).

:-1: Examples of **incorrect** code for this rule:

```html
<div fooBar="abc">

<div FOO-BAR="abc">
```

:+1: Examples of **correct** code for this rule:

```html
<div foo-bar="abc">
```

## Options

```json
{
  "lodash-template/attribute-name-casing": ["error", {
    "ignore": [],
  }]
}
```

:+1: Examples of **correct** code for this rule with `"ignore": ["onClick"]` option:

```html
<div onClick="abc">
```
