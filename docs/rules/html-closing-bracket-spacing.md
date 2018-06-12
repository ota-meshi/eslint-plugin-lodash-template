# require or disallow a space before tag's closing brackets. (ex. :ng: `<input·>` `<input/>`) (lodash-template/html-closing-bracket-spacing)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces consistent spacing style before closing brackets `>` of tags.

```html
<div class="foo"> or <div class="foo" >
<input class="foo"/> or <input class="foo" />
```

:-1: Examples of **incorrect** code for this rule:

```html
<div >
<div foo >
<div foo="bar" >
</div >
<br/>
<input foo/>
<input foo="bar"/>
```

:+1: Examples of **correct** code for this rule:

```html
<div>
<div foo>
<div foo="bar">
</div>
<br />
<input foo />
<input foo="bar" />
```


## Options


```json
{
  "lodash-template/html-closing-bracket-spacing": ["error", {
    "startTag": "always" | "never",
    "endTag": "always" | "never",
    "selfClosingTag": "always" | "never"
  }]
}
```

- `startTag` (`"always" | "never"`) ... Setting for the `>` of start tags (e.g. `<div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `endTag` (`"always" | "never"`) ... Setting for the `>` of end tags (e.g. `</div>`). Default is `"never"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.
- `selfClosingTag` (`"always" | "never"`) ... Setting for the `/>` of self-closing tags (e.g. `<br/>`). Default is `"always"`.
    - `"always"` ... requires one or more spaces.
    - `"never"` ... disallows spaces.

:+1: Examples of **correct** code for this rule:

```html
<% /* eslint lodash-template/html-closing-bracket-spacing: ["error", {
    "startTag": "always",
    "endTag": "always",
    "selfClosingTag": "always"
}] */ %>

<div >
<div foo >
<div foo="bar" >
</div >
<br />
<input foo />
<input foo="bar" />
```
