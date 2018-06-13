# enforce quotes style of HTML attributes. (ex. :ok: `<div class="abc">` :ng: `<div class='abc'>` `<div class=abc>`) (lodash-template/attribute-value-quote)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces the quotes style of HTML attributes.

:-1: Examples of **incorrect** code for this rule:

```html
<img src='./logo.png'>
<img src=./logo.png>
```

:+1: Examples of **correct** code for this rule:

```html
<img src="./logo.png">
```

## Options

- `"double"` (default) ... requires double quotes.
- `"single"` ... requires single quotes.
- `"either"` ... requires single quotes or double quotes.

:-1: Examples of **incorrect** code for this rule with `"single"` option:

```html
<img src="./logo.png">
<img src=./logo.png>
```

:+1: Examples of **correct** code for this rule with `"single"` option:

```html
<img src='./logo.png'>
```

:-1: Examples of **incorrect** code for this rule with `"either"` option:

```html
<img src=./logo.png>
```

:+1: Examples of **correct** code for this rule with `"either"` option:

```html
<img src="./logo.png">
<img src='./logo.png'>
```


