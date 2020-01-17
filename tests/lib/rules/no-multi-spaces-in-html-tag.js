"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-multi-spaces-in-html-tag")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2020,
    },
})

tester.run("no-multi-spaces-in-html-tag", rule, {
    valid: [
        {
            filename: "test.html",
            code: `
        <input
          class="foo"
          type="text"
        >

        <input class="foo" type="text">
        `,
        },
        {
            filename: "test.html",
            code: `
        <%
        var a = 1;

        if(foo === "bar") {}

        a << b

        var arr = [1, 2];

        a ? b: c
        %>
        `,
        },
        {
            filename: "test.html",
            code: `
        <div></div>
        `,
        },
        // template tag
        {
            filename: "test.html",
            code: `
        <input <%=  'date-attr1'  %> class=" <%=  class1  %> "
              type=" <%=  type1  %> " <%=  'date-attr2'  %> >
        `,
        },
        {
            filename: "test.html",
            code: `
        <li><%- user %></li>
        `,
        },
        {
            filename: "test.html",
            code: `
        <% if (a) { %>  <div></div>  <% } %> >
        `,
        },
        {
            filename: "test.html",
            code: `
        <%- user %>
        `,
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: `
            <input     class="foo"
                  type="text"         >
            `,
            output: `
            <input class="foo"
                  type="text" >
            `,
            errors: [
                'Multiple spaces found before `class="foo"`.',
                "Multiple spaces found before `>`.",
            ],
        },
        {
            filename: "test.html",
            code: `
            <input type="text"         />
            `,
            output: `
            <input type="text" />
            `,
            errors: ["Multiple spaces found before `/>`."],
        },
        {
            filename: "test.html",
            code: `
            <input   <%=  'date-attr1'  %>    class=" <%=  class1  %> "
                  type=" <%=  type1  %> "      <%=  'date-attr2'  %>   >
            `,
            output: `
            <input <%=  'date-attr1'  %> class=" <%=  class1  %> "
                  type=" <%=  type1  %> " <%=  'date-attr2'  %> >
            `,
            errors: [
                "Multiple spaces found before `<%=  'date-attr1'  %>`.",
                'Multiple spaces found before `class=" <%=  class1  %> "`.',
                "Multiple spaces found before `<%=  'date-attr2'  %>`.",
                "Multiple spaces found before `>`.",
            ],
        },
        {
            filename: "test.html",
            code: `
            <input   <%=  'date-attr1'  %>   <%=  'class="'+  class1  +'"'  %> 
                  <%=  'type="'+type1+'"'  %>       <%=  'date-attr2'  %>   >
            `,
            output: `
            <input <%=  'date-attr1'  %> <%=  'class="'+  class1  +'"'  %> 
                  <%=  'type="'+type1+'"'  %> <%=  'date-attr2'  %> >
            `,
            errors: [
                "Multiple spaces found before `<%=  'date-attr1'  %>`.",
                "Multiple spaces found before `<%=  'class=\"'+  class1  +'\"'  %>`.",
                "Multiple spaces found before `<%=  'date-attr2'  %>`.",
                "Multiple spaces found before `>`.",
            ],
        },
        {
            filename: "test.html",
            code: `
            <input
                <% if (a) { %>
                    class="foo"   type="text"
                <% } %>   >
            `,
            output: `
            <input
                <% if (a) { %>
                    class="foo" type="text"
                <% } %> >
            `,
            errors: [
                'Multiple spaces found before `type="text"`.',
                "Multiple spaces found before `>`.",
            ],
        },
        {
            filename: "test.html",
            code: `
            <div></div      >
            `,
            output: `
            <div></div >
            `,
            errors: ["Multiple spaces found before `>`."],
        },
        // duplication attr
        {
            filename: "test.html",
            code: `
            <input
                <% if (a) { %>
                    id="id"  class="foo"   type="text"   value="text value"
                <% } else { %>
                    class="foo2"   type="text2"
                <% } %>
                   >
            `,
            output: `
            <input
                <% if (a) { %>
                    id="id"  class="foo"   type="text"   value="text value"
                <% } else { %>
                    class="foo2" type="text2"
                <% } %>
                   >
            `,
            errors: [
                // "Multiple spaces found before `value=\"text value\"`.",
                'Multiple spaces found before `type="text2"`.',
            ],
        },
    ],
})
