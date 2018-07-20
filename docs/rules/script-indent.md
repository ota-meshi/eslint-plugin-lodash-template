# enforce consistent indentation to script in micro-template tag. (lodash-template/script-indent)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a consistent indentation style to script in micro-template tag. The default style is 2 spaces.

:-1: Examples of **incorrect** code for this rule:

```html
<% for (
      let i = 0;
    i < arr.length;
  i++
    ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

:+1: Examples of **correct** code for this rule:

```html
<% for (
    let i = 0;
    i < arr.length;
    i++
  ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

## Options

```json
{
  "lodash-template/script-indent": ["error", type, {
    "startIndent": 1,
    "switchCase": 0
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `startIndent` (`integer`) ... The multiplier of indentation for top-level statements in micro-template tag. Default is `1`.
- `switchCase` (`integer`) ... The multiplier of indentation for `case`/`default` clauses. Default is `0`.

:+1: Examples of **correct** code for `{startIndent: 0}`:

```html
<% for (
  let i = 0;
  i < arr.length;
  i++
) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```

:+1: Examples of **correct** code for `{startIndent: 2}`:

```html
<% for (
      let i = 0;
      i < arr.length;
      i++
    ) { %>
  <div class="<%= arr[i] %>"></div>
<% } %>
```
