---
sidebarDepth: 1
---

# AST for HTML

- [HTMLToken](#htmltoken)
- [HTMLNode](#htmlnode)
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
    const microTemplateService = sourceCode.parserServices.getMicroTemplateService()
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

See details: [https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/ast/html-nodes.js](../../lib/ast/html-nodes.js)

## HTMLToken

```ts
extend interface HTMLToken {
    range: [ number ],
    htmlValue: string,
    value: string,
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## HTMLNode

```ts
extend interface HTMLNode {
    range: [ number ]
}
```

- The `range` property is an array which has 2 integers.
  The 1st integer is the offset of the start location of the node.
  The 2nd integer is the offset of the end location of the node.

## HTMLDocument

```ts
interface HTMLDocument <: HTMLNode {
    type: "HTMLDocument",
    children: [ HTMLElement | HTMLText | HTMLComment ]
}
```

- This is a HTML Document.

## HTMLDocumentFragment

```ts
interface HTMLDocumentFragment <: HTMLNode  {
    type: "HTMLDocumentFragment",
    children: [ HTMLElement | HTMLText | HTMLComment ]
}
```

- This is a HTML DocumentFragment.

## HTMLDocumentType

```ts
interface HTMLDocumentType <: HTMLNode  {
    type: "HTMLDocumentType",
    name: string,
    publicId: string,
    systemId: string
}
```

- This is a HTML Document Type.

## HTMLComment

```ts
interface HTMLComment <: HTMLNode  {
    type: "HTMLComment",
    value: string,
    commentOpen: HTMLToken | null,
    commentClose: HTMLToken | null,
}
```

- This is a HTML comment node.

## HTMLText

```ts
interface HTMLText <: HTMLNode  {
    type: "HTMLText",
    value: string
}
```

- This is a HTML text node.

## HTMLElement

```ts
interface HTMLElement <: HTMLNode  {
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
interface HTMLStartTag <: HTMLNode  {
    type: "HTMLStartTag",
    attributes: [ HTMLAttribute ],
    tagOpen: HTMLToken,
    tagClose: HTMLToken,
    selfClosing: boolean,
    ignoredAttributes: [ HTMLAttribute ],
}
```

- This is a HTML element start tag.

## HTMLAttribute

```ts
interface HTMLAttribute <: HTMLNode  {
    type: "HTMLAttribute",
    key: string,
    vakue: string,
    keyToken: HTMLToken,
    eqToken: HTMLToken | null,
    valueToken: HTMLToken | null,
}
```

- This is a HTML attribute.

## HTMLEndTag

```ts
interface HTMLEndTag <: HTMLNode  {
    type: "HTMLEndTag",
    tagOpen: HTMLToken,
    tagClose: HTMLToken,
}
```

- This is a HTML element end tag.

