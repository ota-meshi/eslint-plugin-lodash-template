# enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`) (lodash-template/html-comment-spacing)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to enforce unified spacing in HTML comment.

:-1: Examples of **incorrect** code for this rule:

```html
<!--   comment   -->
<!--comment-->
```

:+1: Examples of **correct** code for this rule:

```html
<!-- comment -->
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
<!--   comment   -->
<!--comment-->
```

:+1: Examples of **correct** code for this rule:

```html
<!-- comment -->
```

### `"never"` - Expect no spaces between expression and curly brackets.

:-1: Examples of **incorrect** code for this rule:

```html
<!-- comment -->
```

:+1: Examples of **correct** code for this rule:

```html
<!--comment-->
```
