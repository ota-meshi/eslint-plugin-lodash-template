# AST for `<%= templateTag %>`

- [Token](#token)
- [MicroTemplateEvaluate](#microtemplateevaluate)
- [MicroTemplateInterpolate](#microtemplateinterpolate)
- [MicroTemplateEscape](#microtemplateescape)
- [MicroTemplateExpressionStart](#microtemplateexpressionstart)
- [MicroTemplateExpressionEnd](#microtemplateexpressionend)

You can use the type definition of this AST:

```ts

export function create(context) {
    const microTemplateService = context.parserServices.getMicroTemplateService()
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


## Token

```js
extend interface Token {
    range: [ number ]
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## MicroTemplateEvaluate

```js
interface MicroTemplateEvaluate <: Token {
    type: "MicroTemplateEvaluate",
    expressionStart: MicroTemplateExpressionStart,
    expressionEnd: MicroTemplateExpressionEnd
}
```

- This is a template tag that is evaluated as script.
- The start tag information is stored in the `expressionStart` property.
- The end tag information is stored in the `expressionEnd` property.

## MicroTemplateInterpolate

```js
interface MicroTemplateInterpolate <: Token  {
    type: "MicroTemplateInterpolate",
    expressionStart: MicroTemplateExpressionStart,
    expressionEnd: MicroTemplateExpressionEnd
}
```

- This is a template tag that is interpolate as template.
- The start tag information is stored in the `expressionStart` property.
- The end tag information is stored in the `expressionEnd` property.

## MicroTemplateEscape

```js
interface MicroTemplateInterpolate <: Token  {
    type: "MicroTemplateEscape",
    expressionStart: MicroTemplateExpressionStart,
    expressionEnd: MicroTemplateExpressionEnd
}
```

- This is a template tag that is escapes to interpolate as template.
- The start tag information is stored in the `expressionStart` property.
- The end tag information is stored in the `expressionEnd` property.

## MicroTemplateExpressionStart

```js
interface MicroTemplateExpressionStart <: Token  {
    type: "MicroTemplateExpressionStart",
    chars: string
}
```

- This is the start tag of the template tag.
- The delimiter string is stored in the `chars` property.

## MicroTemplateExpressionEnd

```js
interface MicroTemplateExpressionEnd <: Token  {
    type: "MicroTemplateExpressionEnd",
    chars: string
}
```

- This is the end tag of the template tag.
- The delimiter string is stored in the `chars` property.



