"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-multi-spaces-in-script")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-multi-spaces-in-script", rule, {
    valid: [
        `
        <input
          class="foo"
          type="text"
        >

        <input class="foo" type="text">
        `,
        `
        <%
        var a = 1;

        if(foo === "bar") {}

        a << b

        var arr = [1, 2];

        a ? b: c
        %>
        `,
        `
        <div></div>
        `,
        // template tag
        `
        <input <%=  'date-attr1'  %> class=" <%=  class1  %> "
              type=" <%=  type1  %> " <%=  'date-attr2'  %> >
        `,
        `
        <li><%- user %></li>
        `,
        `
        <% if (a) { %>  <div></div>  <% } %> >
        `,
        `
        <%- user %>
        `,

        { code: "<% var x = 5; // comment %>", options: [{ ignoreEOLComments: false }] },
        { code: "<% var x = 5; /* multiline\n * comment\n */ %>", options: [{ ignoreEOLComments: false }] },
        { code: "<% var x = 5;\n  // comment %>", options: [{ ignoreEOLComments: false }] },
        { code: "<% var x = 5;  \n// comment %>", options: [{ ignoreEOLComments: false }] },
        { code: "<% var x = 5;\n  /* multiline\n * comment\n */ %>", options: [{ ignoreEOLComments: false }] },
        { code: "<% var x = 5;  \n/* multiline\n * comment\n */ %>", options: [{ ignoreEOLComments: false }] },
        { code: "<% var x = 5;  // comment %>", options: [{ ignoreEOLComments: true }] },
        { code: "<% var x = 5;  /* multiline\n * comment\n */ %>", options: [{ ignoreEOLComments: true }] },
        { code: "<% var x = 5;\n  // comment %>", options: [{ ignoreEOLComments: true }] },
        { code: "<% var x = 5;  \n// comment %>", options: [{ ignoreEOLComments: true }] },
        { code: "<% var x = 5;\n  /* multiline\n * comment\n */ %>", options: [{ ignoreEOLComments: true }] },
        { code: "<% var x = 5;  \n/* multiline\n * comment\n */ %>", options: [{ ignoreEOLComments: true }] },

        {
            code: "<% var  answer = 6 *  7; %>",
            options: [{ exceptions: { VariableDeclaration: true, BinaryExpression: true } }],
        },
    ],
    invalid: [
        {
            code: `
            <%
            var a =  1;

            if(foo   === "bar") {}

            a <<  b

            var arr = [1,  2];

            a ?  b: c
            %>
            `,
            output: `
            <%
            var a = 1;

            if(foo === "bar") {}

            a << b

            var arr = [1, 2];

            a ? b: c
            %>
            `,
            errors: [
                "Multiple spaces found before `1`.",
                "Multiple spaces found before `===`.",
                "Multiple spaces found before `b`.",
                "Multiple spaces found before `2`.",
                "Multiple spaces found before `b`.",
            ],
        },
        {
            code: `
            <input   <%=  'date-attr1'  %>   <%=  'class="'+  class1  +'"'  %> 
                  <%=  'type="'+type1+'"'  %>       <%=  'date-attr2'  %>   >
            `,
            output: `
            <input   <%=  'date-attr1'  %>   <%=  'class="'+ class1 +'"'  %> 
                  <%=  'type="'+type1+'"'  %>       <%=  'date-attr2'  %>   >
            `,
            errors: [
                "Multiple spaces found before `class1`.",
                "Multiple spaces found before `+`.",
            ],
        },
        {
            code: `
            <% if (a)  {   // comment %>
                <div></div>
            <% }  /*comment comment*/ %> >
            `,
            output: `
            <% if (a) { // comment %>
                <div></div>
            <% } /*comment comment*/ %> >
            `,
            errors: [
                "Multiple spaces found before `{`.",
                "Multiple spaces found before `// comment   `.",
                "Multiple spaces found before `/*comment comm...*/`.",
            ],
        },
        // not html
        {
            code: `
            <% if (a)  {   // comment %>
                template
            <% }  /*comment comment*/ %> >
            `,
            output: `
            <% if (a) { // comment %>
                template
            <% } /*comment comment*/ %> >
            `,
            errors: [
                "Multiple spaces found before `{`.",
                "Multiple spaces found before `// comment   `.",
                "Multiple spaces found before `/*comment comm...*/`.",
            ],
        },
        {
            code: "<% var x =  /* comment */ 5; %>",
            output: "<% var x = /* comment */ 5; %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `/* comment */`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x = /* comment */  5; %>",
            output: "<% var x = /* comment */ 5; %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `5`.",
                type: "Numeric",
            }],
        },
        {
            code: "<% var x = 5;  // comment %>",
            output: "<% var x = 5; // comment %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `// comment   `.",
                type: "Line",
            }],
        },
        {
            code: "<% var x = 5;  // comment\nvar y = 6; %>",
            output: "<% var x = 5; // comment\nvar y = 6; %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `// comment`.",
                type: "Line",
            }],
        },
        {
            code: "<% var x = 5;  /* multiline\n * comment\n */ %>",
            output: "<% var x = 5; /* multiline\n * comment\n */ %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `/* multiline...*/`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x = 5;  /* multiline\n * comment\n */\nvar y = 6; %>",
            output: "<% var x = 5; /* multiline\n * comment\n */\nvar y = 6; %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `/* multiline...*/`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x = 5;  // this is a long comment %>",
            output: "<% var x = 5; // this is a long comment %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `// this is a l...`.",
                type: "Line",
            }],
        },
        {
            code: "<% var x =  /* comment */ 5;  // EOL comment %>",
            output: "<% var x = /* comment */ 5;  // EOL comment %>",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                message: "Multiple spaces found before `/* comment */`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x =  /* comment */ 5;  // EOL comment\nvar y = 6; %>",
            output: "<% var x = /* comment */ 5;  // EOL comment\nvar y = 6; %>",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                message: "Multiple spaces found before `/* comment */`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x = /* comment */  5;  /* EOL comment */ %>",
            output: "<% var x = /* comment */ 5;  /* EOL comment */ %>",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                message: "Multiple spaces found before `5`.",
                type: "Numeric",
            }],
        },
        {
            code: "<% var x = /* comment */  5;  /* EOL comment */\nvar y = 6; %>",
            output: "<% var x = /* comment */ 5;  /* EOL comment */\nvar y = 6; %>",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                message: "Multiple spaces found before `5`.",
                type: "Numeric",
            }],
        },
        {
            code: "<% var x =  /*comment without spaces*/ 5; %>",
            output: "<% var x = /*comment without spaces*/ 5; %>",
            options: [{ ignoreEOLComments: true }],
            errors: [{
                message: "Multiple spaces found before `/*comment with...*/`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x = 5;  //comment without spaces %>",
            output: "<% var x = 5; //comment without spaces %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `//comment with...`.",
                type: "Line",
            }],
        },
        {
            code: "<% var x = 5;  /*comment without spaces*/ %>",
            output: "<% var x = 5; /*comment without spaces*/ %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `/*comment with...*/`.",
                type: "Block",
            }],
        },
        {
            code: "<% var x = 5;  /*comment\n without spaces*/ %>",
            output: "<% var x = 5; /*comment\n without spaces*/ %>",
            options: [{ ignoreEOLComments: false }],
            errors: [{
                message: "Multiple spaces found before `/*comment...*/`.",
                type: "Block",
            }],
        },

        {
            code: "<% ({ a:   b }) %>",
            output: "<% ({ a: b }) %>",
            options: [{ exceptions: { Property: false } }],
            errors: [{
                message: "Multiple spaces found before `b`.",
                type: "Identifier",
            }],
        },
    ],
})
