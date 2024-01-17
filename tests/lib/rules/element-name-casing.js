"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/element-name-casing");

const tester = new RuleTester({
    languageOptions: {
        parser: require("../../../lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("element-name-casing", rule, {
    valid: [
        { filename: "test.html", code: "<body><div/></body>" },
        { filename: "test.html", code: "<body><img></body>" },
        { filename: "test.html", code: "<body><svg><path/></svg></body>" },
        { filename: "test.html", code: "<body><math><mspace/></math></body>" },
        {
            filename: "test.html",
            code: "<body><div><slot></slot></div></body>",
        },
        {
            filename: "test.html",
            code: "<body><xxx-element></xxx-element></body>",
        },
    ],
    invalid: [
        {
            filename: "test.html",
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
            filename: "test.html",
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
            errors: ["Element name `<XXX-ELEMENT>` must be 'kebab-case'."],
        },
        {
            filename: "test.html",
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
            errors: ["Element name `<XXX-ELEMENT>` must be 'kebab-case'."],
        },
        {
            filename: "test.html",
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
            errors: ["Element name `<XXX-ELEMENT>` must be 'kebab-case'."],
        },
        {
            filename: "test.html",
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
            filename: "test.html",
            code: `
<body>
  <xxxElement/>
</body>
`,
            output: null,
            errors: ["Element name `<xxxElement>` must be 'kebab-case'."],
        },
        {
            filename: "test.html",
            code: `
<body>
  <XxxElement/>
</body>
`,
            output: null,
            errors: ["Element name `<XxxElement>` must be 'kebab-case'."],
        },
        {
            filename: "test.html",
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
            filename: "test.html",
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
            filename: "test.html",
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
});
