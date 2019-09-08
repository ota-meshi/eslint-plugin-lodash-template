/* eslint no-multi-spaces: error */
<% /* eslint no-multi-spaces: error */ %>

// if this plugin is not used, a parsing error will occur.
const obj = <%= JSON.stringify(param ) %>
//       ^^^^                          ^^^^^ 
//         |                            |
//         |          If you don't use `"plugin:lodash-template/recommended-with-js"`,
//         |          only the space after `param` is reported.
//         |
//         + When using `"plugin:lodash-template/recommended-with-js"`, the space after `obj` is also reported.
