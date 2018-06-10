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

See details: [../../lib/ast/html-nodes.js](../../lib/ast/html-nodes.js)


## Node

```ts
extend interface Node {
    range: [ number ]
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## HTMLDocument

```ts
interface HTMLDocument <: Node {
    type: "HTMLDocument",
    children: [ HTMLElement | HTMLText | HTMLComment ]
}
```

- This is a HTML Document.

## HTMLDocumentFragment

```ts
interface HTMLDocumentFragment <: Node  {
    type: "HTMLDocumentFragment",
    children: [ HTMLElement | HTMLText | HTMLComment ]
}
```

- This is a HTML DocumentFragment.

## HTMLDocumentType

```ts
interface HTMLDocumentType <: Node  {
    type: "HTMLDocumentType",
    name: string,
    publicId: string,
    systemId: string
}
```

- This is a HTML Document Type.

## HTMLComment

```ts
interface HTMLComment <: Node  {
    type: "HTMLComment",
    value: string
}
```

- This is a HTML comment node.

## HTMLText

```ts
interface HTMLText <: Node  {
    type: "HTMLText",
    value: string
}
```

- This is a HTML text node.

## HTMLElement

```ts
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

```ts
interface HTMLStartTag <: Node  {
    type: "HTMLStartTag",
    attributes: [ HTMLAttribute ]
}
```

- This is a HTML element start tag.

## HTMLAttribute

```ts
interface HTMLAttribute <: Node  {
    type: "HTMLAttribute",
    key: string,
    vakue: string
}
```

- This is a HTML attribute.

## HTMLEndTag

```ts
interface HTMLEndTag <: Node  {
    type: "HTMLEndTag"
}
```

- This is a HTML element end tag.

