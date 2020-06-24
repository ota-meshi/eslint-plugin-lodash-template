---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/attribute-name-casing"
description: "enforce HTML attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`)"
---
# lodash-template/attribute-name-casing
> enforce HTML attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`)

- :gear: This rule is included in `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule enforces attribute name casing style (kebab-case).

<eslint-code-block fix :rules="{'lodash-template/attribute-name-casing': ['error']}">

```html
<!-- ✓ GOOD -->
<div foo-bar="abc">

<!-- ✗ BAD -->
<div fooBar="abc">
<div FOO-BAR="abc">
```

</eslint-code-block>

## Options

```json
{
  "lodash-template/attribute-name-casing": ["error", {
    "ignore": [],
    "ignoreSvgCamelCaseAttributes": true,
  }]
}
```

### Examples for this rule with `"ignore": ["onClick"]` option:

<eslint-code-block fix :rules="{'lodash-template/attribute-name-casing': ['error', {'ignore': ['onClick']}]}">

```html
<!-- ✓ GOOD -->
<div onClick="abc">
```

</eslint-code-block>

### Examples for this rule with `"ignoreSvgCamelCaseAttributes": true,` (default)

<eslint-code-block fix :rules="{'lodash-template/attribute-name-casing': ['error', {'ignoreSvgCamelCaseAttributes': true}]}">

```html
<!-- ✓ GOOD -->
<svg viewBox="0 0 100 100"></svg>
```

</eslint-code-block>

## Further Reading

* [Google HTML/CSS Style Guide *Capitalization*](https://google.github.io/styleguide/htmlcssguide.html#Capitalization)
* [HTML - MDN - Mozilla *`data-*`*](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*)
* [HTML5 *Embedding custom non-visible data with the `data-*` attributes*](https://www.w3.org/TR/html5/dom.html#embedding-custom-non-visible-data-with-the-data-attributes)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/attribute-name-casing.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/attribute-name-casing.js)
