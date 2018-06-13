"use strict"


const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/element-name-casing")


const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})


tester.run("element-name-casing", rule, {
    valid: [
        "<body><div/></body>",
        "<body><img></body>",
        "<body><svg><path/></svg></body>",
        "<body><math><mspace/></math></body>",
        "<body><div><slot></slot></div></body>",

        "<body><xxx-element></xxx-element></body>",
        "<body><div/></body>",
        "<body><img></body>",
        "<body><svg><path/></svg></body>",
        "<body><math><mspace/></math></body>",
    ],
    invalid: [
        {
            code: `
<body>
  <XXX-ELEMENT id="id">
    <!-- comment -->
  </XXX-ELEMENT>
</body>
`,
            output: `
<body>
  <xxx-element id="id">
    <!-- comment -->
  </xxx-element>
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
                "Element name `</XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT id="id"/>
</body>
`,
            output: `
<body>
  <xxx-element id="id"/>
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT
    id="id"/>
</body>
`,
            output: `
<body>
  <xxx-element
    id="id"/>
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT/>
</body>
`,
            output: `
<body>
  <xxx-element/>
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT></XXX-ELEMENT>
</body>
`,
            output: `
<body>
  <xxx-element></xxx-element>
</body>
`,

            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
                "Element name `</XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <xxxElement/>
</body>
`,
            output: null,
            errors: [
                "Element name `<xxxElement>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XxxElement/>
</body>
`,
            output: null,
            errors: [
                "Element name `<XxxElement>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT></XXX-ELEMENT  >
</body>
`,
            output: `
<body>
  <xxx-element></xxx-element  >
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
                "Element name `</XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT></XXX-ELEMENT
  >
</body>
`,
            output: `
<body>
  <xxx-element></xxx-element
  >
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
                "Element name `</XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
        {
            code: `
<body>
  <XXX-ELEMENT></XXX-ELEMENT end-tag-attr="attr"
  >
</body>
`,
            output: `
<body>
  <xxx-element></xxx-element end-tag-attr="attr"
  >
</body>
`,
            errors: [
                "Element name `<XXX-ELEMENT>` must be 'kebab-case'.",
                "Element name `</XXX-ELEMENT>` must be 'kebab-case'.",
            ],
        },
    ],
})
