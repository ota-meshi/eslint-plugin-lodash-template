# disallow multiple spaces in script. (ex. :ng: `<% if···(test)···{ %>`) (lodash-template/no-multi-spaces-in-script)

- :gear: This rule is included in all of `"plugin:lodash-template/recommended"`, `"plugin:lodash-template/recommended-with-html"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## Rule Details

This rule aims to disallow multiple whitespace in script which are not used for indentation.

:-1: Examples of **incorrect** code for this rule:

```js
<%
var a =  1;

if(foo   === "bar") {}

a <<  b

var arr = [1,  2];

a ?  b: c
%>
```

:+1: Examples of **correct** code for this rule:

```js
<%
var a = 1;

if(foo === "bar") {}

a << b

var arr = [1, 2];

a ? b: c
%>
```

## Further Reading

* [ESLint `no-multi-spaces` rule](https://eslint.org/docs/rules/no-multi-spaces)