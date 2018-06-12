# disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`) (lodash-template/no-duplicate-attributes)

- :gear: This rule is included in `"plugin:lodash-template/all"`.

## Rule Details

This rule reports duplicate attributes.

When duplicate arguments exist, only the last one is valid.
It's possibly mistakes.

:-1: Examples of **incorrect** code for this rule:

```html
<div
  foo="abc"
  foo="def"
></div>
```

:+1: Examples of **correct** code for this rule:

```html
<div
  foo="abc"
></div>
```
