# enforce HTML element name casing. (ex. :ok: `<xxx-element>` :ng: `<xxxElement>` `<DIV>`) (lodash-template/element-name-casing)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces element name casing style (kebab-case).

:-1: Examples of **incorrect** code for this rule:

```html
<DIV>

<xxxElement>
```

:+1: Examples of **correct** code for this rule:

```html
<div>

<xxx-element>
```


## Further Reading

* [Web Components | MDN  *Using custom elements*](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
