# disallow irregular whitespace outside the template tags. (lodash-template/no-irregular-whitespace)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule disallows the irregular whitespaces.

:-1: Examples of **incorrect** code for this rule:

```html
<div□id="item-id"□class="item-content">
</div□>
```

:+1: Examples of **correct** code for this rule:

```html
<div id="item-id" class="item-content">
</div >
```

## Options

This rule has an object option for exceptions:

* `"skipComments": true` allows any whitespace characters in HTML comments
* `"skipAttrValues": true` allows any whitespace characters in HTML attribute values
* `"skipText": true` allows any whitespace characters in HTML texts

## Further Reading

* [ESLint `no-irregular-whitespace` rule](https://eslint.org/docs/rules/no-irregular-whitespace)