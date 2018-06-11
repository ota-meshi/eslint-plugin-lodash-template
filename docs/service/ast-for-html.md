# AST for HTML

- [Node](#node)
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

## Node

```js
extend interface Node {
    range: [ number ]
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## HTMLDocument

```js
interface HTMLDocument <: Node {
    type: "HTMLDocument",
    children: [ HTMLElement | HTMLText | HTMLComment ]
}
```

- This is a HTML Document.

## HTMLDocumentFragment

```js
interface HTMLDocumentFragment <: Node  {
    type: "HTMLDocumentFragment",
    children: [ HTMLElement | HTMLText | HTMLComment ]
}
```

- This is a HTML DocumentFragment.

## HTMLDocumentType

```js
interface HTMLDocumentType <: Node  {
    type: "HTMLDocumentType",
    name: string,
    publicId: string,
    systemId: string
}
```

- This is a HTML Document Type.

## HTMLComment

```js
interface HTMLComment <: Node  {
    type: "HTMLComment",
    value: string
}
```

- This is a HTML comment node.

## HTMLText

```js
interface HTMLText <: Node  {
    type: "HTMLText",
    value: string
}
```

- This is a HTML text node.

## HTMLElement

```js
interface HTMLElement <: Node  {
    type: "HTMLElement",
    name: string,
    children: [ HTMLElement | HTMLText | HTMLComment ]
    startTag: HTMLStartTag | null,
    endTag: HTMLEndTag | null
}
```

- This is a HTML element node.

## HTMLStartTag

```js
interface HTMLStartTag <: Node  {
    type: "HTMLStartTag",
    attributes: [ HTMLAttribute ]
}
```

- This is a HTML element start tag.

## HTMLAttribute

```js
interface HTMLAttribute <: Node  {
    type: "HTMLAttribute",
    key: string,
    vakue: string
}
```

- This is a HTML attribute.

## HTMLEndTag

```js
interface HTMLEndTag <: Node  {
    type: "HTMLEndTag"
}
```

- This is a HTML element end tag.

