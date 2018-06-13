# enforce the maximum number of attributes per line (lodash-template/max-attributes-per-line)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

Limits the maximum number of attributes/properties per line to improve readability.

This rule aims to enforce a number of attributes per line in HTML.
It checks all the elements and verifies that the number of attributes per line does not exceed the defined maximum.
An attribute is considered to be in a new line when there is a line break between two attributes.

:-1: Examples of **incorrect** code for this rule:

```html
<div foo="1" bar="2">

<div
  foo="1" bar="2"
>

<div
  foo="1" bar="2"
  baz="3"
>
```

:+1: Examples of **correct** code for this rule:

```html
<div foo="1">

<div
  foo="1"
  bar="2"
>

<div
  foo="1"
  bar="2"
  baz="3"
/>
```

### Options

```json
{
  "lodash-template/max-attributes-per-line": ["error", {
    "singleline": 1,
    "multiline": {
      "max": 1,
      "allowFirstLine": false
    }
  }]
}
```

#### `allowFirstLine`

For multi-line declarations, defines if allows attributes to be put in the first line. (Default false)

:-1: Example of **incorrect** code for this setting:

```html
<% /* eslint lodash-template/max-attributes-per-line: ["error", { "multiline": { "allowFirstLine": false }}] */ %>
<div foo="1"
  bar="2"
>
```

:+1: Example of **correct** code for this setting:

```html
<% /* eslint lodash-template/max-attributes-per-line: ["error", { "multiline": { "allowFirstLine": false }}] */ %>
<div
  foo="1"
  bar="2"
>
```

#### `singleline`

Number of maximum attributes per line when the opening tag is in a single line. (Default is 1)

:-1: Example of **incorrect** code for this setting:
```html
<% /* eslint lodash-template/max-attributes-per-line: ["error", { "singleline": 1 }] */ %>
<div foo="1" bar="2">
```

:+1: Example of **correct** code for this setting:
```html
<% /* eslint lodash-template/max-attributes-per-line: ["error", { "singleline": 1 }] */ %>
<div foo="1"/>
```

#### `multiline`

Number of maximum attributes per line when a tag is in multiple lines. (Default is 1)

:-1: Example of **incorrect** code for this setting:

```html
<% /* eslint lodash-template/max-attributes-per-line: ["error", { "multiline": 1 }] */ %>
<div
  foo="1" bar="2"
>
```

:+1: Example of **correct** code for this setting:

```html
<% /* eslint lodash-template/max-attributes-per-line: ["error", { "multiline": 1 }] */ %>
<div
  foo="1"
  bar="2"
>
```
