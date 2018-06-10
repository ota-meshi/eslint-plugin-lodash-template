# AST for HTML

- [Token](#token)
- [HTMLDocument](#htmldocument)
- [HTMLDocumentFragment](#htmldocumentfragment)
- [HTMLDocumentType](#htmldocumenttype)
- [HTMLComment](#htmlcomment)
- [HTMLText](#htmltext)
- [HTMLElement](#htmlelement)
- [HTMLStartTag](#htmlstarttag)
- [HTMLAttribute](#htmlattribute)
- [HTMLEndTag](#htmlendtag)

You can use the type definition of this AST:

```ts

export function create(context) {
    const microTemplateService = context.parserServices.getMicroTemplateService()
    return {
        "Program:exit"() {
            microTemplateService.traverseDocumentNodes({
                HTMLElement(node: HTMLElement): void {
                    // ...
                },
                HTMLText(node: HTMLText): void {
                    // ...
                },
                HTMLComment(node: HTMLComment): void {
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

## HTMLDocument

```js
interface HTMLDocument <: Token {
    type: "HTMLDocument"
}
```

- This is a HTML Document.

## HTMLDocumentFragment

```js
interface HTMLDocumentFragment <: Token  {
    type: "HTMLDocumentFragment"
}
```

- This is a HTML DocumentFragment.

## HTMLDocumentType

```js
interface HTMLDocumentType <: Token  {
    type: "HTMLDocumentType",
    name: string,
    publicId: string,
    systemId: string
}
```

- This is a HTML Document Type.

## HTMLComment

```js
interface HTMLComment <: Token  {
    type: "HTMLComment",
    value: string
}
```

- This is a HTML comment node.

## HTMLText

```js
interface HTMLText <: Token  {
    type: "HTMLText",
    value: string
}
```

- This is a HTML text node.

## HTMLElement

```js
interface HTMLElement <: Token  {
    type: "HTMLElement",
    name: string,
    startTag: HTMLStartTag | null,
    endTag: HTMLEndTag | null
}
```

- This is a HTML element node.

## HTMLStartTag

```js
interface HTMLStartTag <: Token  {
    type: "HTMLStartTag",
    attributes: [HTMLAttribute]
}
```

- This is a HTML element start tag.

## HTMLAttribute

```js
interface HTMLAttribute <: Token  {
    type: "HTMLAttribute",
    key: string,
    vakue: string
}
```

- This is a HTML attribute.

## HTMLEndTag

```js
interface HTMLEndTag <: Token  {
    type: "HTMLEndTag"
}
```

- This is a HTML element end tag.


