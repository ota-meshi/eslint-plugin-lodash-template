---
pageClass: "rule-details"
sidebarDepth: 0
title: "lodash-template/no-multi-spaces-in-scriptlet"
description: "disallow multiple spaces in scriptlet. (ex. :ng: `<% if···(test)···{ %>`)"
---

# lodash-template/no-multi-spaces-in-scriptlet

> disallow multiple spaces in scriptlet. (ex. :ng: `<% if···(test)···{ %>`)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"`, `"plugin:lodash-template/recommended-with-script"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to disallow multiple whitespace in script which are not used for indentation.

<!-- prettier-ignore -->
```html
<% /* eslint "lodash-template/no-multi-spaces-in-scriptlet": "error" */ %>
<!-- ✓ GOOD -->
<%
var a = 1;

if(foo === "bar") {}

a << b

var arr = [1, 2];

a ? b: c
%>

<!-- ✗ BAD -->
<%
var a =  1;

if(foo   === "bar") {}

a <<  b

var arr = [1,  2];

a ?  b: c
%>
```

## Further Reading

- [ESLint `no-multi-spaces` rule](https://eslint.org/docs/rules/no-multi-spaces)

## Implementation

- [Rule source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-multi-spaces-in-scriptlet.js)
- [Test source](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/no-multi-spaces-in-scriptlet.js)
