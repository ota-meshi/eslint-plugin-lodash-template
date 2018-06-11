# disallow specified warning terms in HTML comments. (ex. :ng: `<!-- TODO:task -->`) (lodash-template/no-warning-html-comments)

- :gear: This rule is included in all of `"plugin:lodash-template/best-practices"`, `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.

## Rule Details

This rule reports HTML comments that include any of the predefined terms specified in its configuration.

:-1: Examples of **incorrect** code for this rule:

```html
<!-- TODO -->
```
