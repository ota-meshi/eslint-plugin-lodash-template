---
sidebarDepth: 1
---

# AST for `<%= templateTag %>`

- [Token](#token)
- [Node](#node)
- [MicroTemplateEvaluate](#microtemplateevaluate)
- [MicroTemplateInterpolate](#microtemplateinterpolate)
- [MicroTemplateEscape](#microtemplateescape)
- [MicroTemplateExpressionStart](#microtemplateexpressionstart)
- [MicroTemplateExpressionEnd](#microtemplateexpressionend)

You can use the type definition of this AST:

```ts

export function create(context) {
    const microTemplateService = sourceCode.parserServices.getMicroTemplateService()
    return {
        "Program:exit"() {
            microTemplateService.traverseMicroTemplates({
                MicroTemplateEvaluate(node: MicroTemplateEvaluate): void {
                    // ...
                },
                MicroTemplateInterpolate(node: MicroTemplateInterpolate): void {
                    // ...
                },
                MicroTemplateEscape(node: MicroTemplateEscape): void {
                    // ...
                },
            })
        },
    }
}
```

See details: [https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/ast/micro-template-nodes.js](../../lib/ast/micro-template-nodes.js)


## Token

```ts
extend interface Token {
    range: [ number ]
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## Node

```ts
extend interface Node {
    range: [ number ]
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## MicroTemplateEvaluate

```ts
interface MicroTemplateEvaluate <: Node {
    type: "MicroTemplateEvaluate",
    expressionStart: MicroTemplateExpressionStart,
    expressionEnd: MicroTemplateExpressionEnd,
    code: string
}
```

- This is a template tag that is evaluated as script.
- The start tag information is stored in the `expressionStart` property.
- The end tag information is stored in the `expressionEnd` property.

## MicroTemplateInterpolate

```ts
interface MicroTemplateInterpolate <: Node  {
    type: "MicroTemplateInterpolate",
    expressionStart: MicroTemplateExpressionStart,
    expressionEnd: MicroTemplateExpressionEnd,
    code: string
}
```

- This is a template tag that is interpolate as template.
- The start tag information is stored in the `expressionStart` property.
- The end tag information is stored in the `expressionEnd` property.

## MicroTemplateEscape

```ts
interface MicroTemplateInterpolate <: Node  {
    type: "MicroTemplateEscape",
    expressionStart: MicroTemplateExpressionStart,
    expressionEnd: MicroTemplateExpressionEnd,
    code: string
}
```

- This is a template tag that is escapes to interpolate as template.
- The start tag information is stored in the `expressionStart` property.
- The end tag information is stored in the `expressionEnd` property.

## MicroTemplateExpressionStart

```ts
interface MicroTemplateExpressionStart <: Token  {
    type: "MicroTemplateExpressionStart",
    chars: string
}
```

- This is the start tag of the template tag.
- The delimiter string is stored in the `chars` property.

## MicroTemplateExpressionEnd

```ts
interface MicroTemplateExpressionEnd <: Token  {
    type: "MicroTemplateExpressionEnd",
    chars: string
}
```

- This is the end tag of the template tag.
- The delimiter string is stored in the `chars` property.


