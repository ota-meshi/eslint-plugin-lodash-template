/* eslint no-multi-spaces: error */
<% /* eslint lodash-template/no-multi-spaces-in-scriptlet: error */ %>

// if this plugin is not used, a parsing error will occur.
const obj    = <%= JSON.stringify(param     ) %>
//       ^^^^                          ^^^^^ 
//         |                            |
//         |          If you don't use `"plugin:lodash-template/recommended-with-script"`,
//         |          only the space after `param` is reported.
//         |
//         + When using `"plugin:lodash-template/recommended-with-script"`, the space after `obj` is also reported.
