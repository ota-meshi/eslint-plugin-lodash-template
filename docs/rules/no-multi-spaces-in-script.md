# disallow multiple spaces in script. (ex. :ng: `<% if···(test)···{ %>`) (lodash-template/no-multi-spaces-in-script)

- :gear: This rule is included in `"plugin:lodash-template/recommended"` and `"plugin:lodash-template/all"`.
- :wrench: The `--fix` option on the [command line](http://eslint.org/docs/user-guide/command-line-interface#fix) can automatically fix some of the problems reported by this rule.

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
