# Contributing

## MicroTemplateService

This plugin's parser provides [MicroTemplateService](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/service/MicroTemplateService.js) from `parserServices`.
`MicroTemplateServic` can be get with `context.parserServices.getMicroTemplateService()`.


## Traverse MicroTemplates

- To traverse MicroTemplates we use the `traverseMicroTemplates` method.
- [ast-for-template-tag.md](./ast-for-template-tag.md) is `<%= templateTag %>` AST specification.
- [template-tag-spacing.js](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/template-tag-spacing.js) is an example.

## Traverse HTML

- To traverse HTML we use the `traverseDocumentNodes` method.
- [ast-for-html.md](./ast-for-html.md) is HTML AST specification.
- [no-html-comments.js](https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/no-html-comments.js) is an example.

