# disallow multiple spaces in html tags. (ex. :ng: `<input···type="text">`) (lodash-template/no-multi-spaces-in-html-tag)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to disallow multiple whitespace in a between attributes which are not used for indentation.

:-1: Examples of **incorrect** code for this rule:

```html
<input     class="foo"
      type="text"         >
```

:+1: Examples of **correct** code for this rule:

```html
<input
  class="foo"
  type="text"
>

<input class="foo" type="text">
```