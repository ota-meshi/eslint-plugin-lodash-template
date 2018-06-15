# require or disallow a line break before and after HTML contents (lodash-template/html-content-newline)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a line break (or no line break) before and after HTML contents.


:-1: Examples of **incorrect** for this rule:

```html
<div
  class="panel"
>content</div>
```

:+1: Examples of **correct** code for this rule:

```html
<div class="panel">content</div>

<div class="panel">
  content
</div>

<div
  class="panel"
>
  content
</div>
```


## Options

```json
{
    "lodash-template/html-content-newline": ["error", {
        "singleline": "ignore",
        "multiline": "always",
        "ignoreNames": ["pre", "textarea"]
    }]
}
```

- `singleline` ... the configuration for single-line elements. It's a single-line element if startTag, endTag and contents are single-line.
    - `"ignore"` ... Don't enforce line breaks style before and after the contents. This is the default.
    - `"never"` ... disallow line breaks before and after the contents.
    - `"always"` ... require one line break before and after the contents.
- `multiline` ... the configuration for multiline elements. It's a multiline element if startTag, endTag or contents are multiline.
    - `"ignore"` ... Don't enforce line breaks style before and after the contents.
    - `"never"` ... disallow line breaks before and after the contents.
    - `"always"` ... require one line break before and after the contents. This is the default.
- `ignoreNames` ... the configuration for element names to ignore line breaks style.  
    default `["pre", "textarea"]`


:-1: Examples of **incorrect** code:

```html
<% /*eslint lodash-template/html-content-newline: ["error", { "singleline": "always", "multiline": "never"}] */ %>

<div class="panel">content</div>

<div
  class="panel"
>
  content
</div>
```

:+1: Examples of **correct** code:

```html
<% /*eslint lodash-template/html-content-newline: ["error", { "singleline": "always", "multiline": "never"}] */ %>

<div class="panel">
  content
</div>

<div
  class="panel"
>content</div>
```
