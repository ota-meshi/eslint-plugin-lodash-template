# disallow specified warning terms in HTML comments. (ex. :-1: `<!-- TODO:task -->`) (lodash-template/no-warning-html-comments)

- :gear: This rule is included in `"plugin:lodash-template/best-practices"` and `"plugin:lodash-template/recommended"`.

## Rule Details

This rule reports HTML comments that include any of the predefined terms specified in its configuration.

:-1: Examples of **incorrect** code for this rule:

```html
<!-- TODO -->
```
