# enforce consistent HTML indentation (lodash-template/html-indent)

- :gear: This rule is included in `"plugin:lodash-template/recommended"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces a consistent HTML indentation style. The default style is 2 spaces.

:-1: Examples of **incorrect** code for this rule:

```html
<div>
 <div class="foo">
   Hello.
    </div>
</div>
```

:+1: Examples of **correct** code for this rule:

```html
<div>
  <div class="foo">
    Hello.
  </div>
</div>
```

## Options

```json
{
  "lodash-template/html-indent": ["error", type, {
    "attribute": 1,
    "closeBracket": 0
  }]
}
```

- `type` (`number | "tab"`) ... The type of indentation. Default is `2`. If this is a number, it's the number of spaces for one indent. If this is `"tab"`, it uses one tab for one indent.
- `attribute` (`integer`) ... The multiplier of indentation for attributes. Default is `1`.
- `closeBracket` (`integer`) ... The multiplier of indentation for right brackets. Default is `0`.

:+1: Examples of **correct** code for `{attribute: 1, closeBracket: 1}`:

```html
<div>
  <div
    id="a"
    class="b"
    attr1="c"
    attr2="d"
    >
    Text
  </div>
</div>
```

:+1: Examples of **correct** code for `{attribute: 2, closeBracket: 1}`:

```html
<div>
  <div
      id="a"
      class="b"
      attr1="c"
      attr2="d"
    >
    Text
  </div>
</div>
```
