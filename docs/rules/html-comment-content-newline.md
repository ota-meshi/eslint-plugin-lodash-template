# require or disallow a line break before and after HTML comment contents (lodash-template/html-comment-content-newline)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a line break (or no line break) before and after HTML comment contents.


:-1: Examples of **incorrect** for this rule:

```html
<!--
  comment
-->

<!--
  comment
  comment -->
```

:+1: Examples of **correct** code for this rule:

```html
<!-- comment -->

<!--
  comment
  comment
-->
```


## Options

```json
{
    "lodash-template/html-comment-content-newline": ["error", {
        "singleline": "never",
        "multiline": "always",
    }]
}
```

- `singleline` ... the configuration for single-line comments.
    - `"ignore"` ... Don't enforce line breaks style before and after the comments.
    - `"never"` ... disallow line breaks before and after the comments. This is the default.
    - `"always"` ... require one line break before and after the comments.
- `multiline` ... the configuration for multiline comments.
    - `"ignore"` ... Don't enforce line breaks style before and after the comments.
    - `"never"` ... disallow line breaks before and after the comments.
    - `"always"` ... require one line break before and after the comments. This is the default.


:-1: Examples of **incorrect** code:

```html
<% /*eslint lodash-template/html-comment-content-newline: ["error", { "singleline": "always", "multiline": "never"}] */ %>

<!-- content -->

<!--
  comment
  comment
-->
```

:+1: Examples of **correct** code:

```html
<% /*eslint lodash-template/html-comment-content-newline: ["error", { "singleline": "always", "multiline": "never"}] */ %>

<!--
  content
-->

<!-- comment
  comment -->
```

## Further Reading

* [HTML5 Style Guide - W3Schools *HTML Comments*](https://www.w3schools.com/html/html5_syntax.asp)
