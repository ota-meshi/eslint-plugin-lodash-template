"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/attribute-name-casing")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("attribute-name-casing", rule, {
    valid: [
        {
            filename: "test.html",
            code: "",
        },
        {
            filename: "test.html",
            code:
                '<body><div><div data-id="foo" aria-test="bar" my-prop="prop"></div></div></body>',
        },
        {
            filename: "test.html",
            code:
                '<body><div data-id="foo" aria-test="bar"><a onclick="" my-prop="prop"></a></div></body>',
        },
        "<body><div><div data-id aria-test my-prop></div></div></body>",
        {
            filename: "test.html",
            code: '<body><div onClick="onClick"></div></body>',
            options: [{ ignore: ["onClick"] }],
        },
    ],

    invalid: [
        {
            filename: "test.html",
            code: '<body><div><div MyProp="Bar"></div></div></body>',
            output: null,
            errors: [
                {
                    message: "Attribute `MyProp` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<body><div><div myProp="Bar"></div></div></body>',
            output: null,
            errors: [
                {
                    message: "Attribute `myProp` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<body><div><div my_prop="Bar"></div></div></body>',
            output: null,
            errors: [
                {
                    message: "Attribute `my_prop` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<body><div><div MY-PROP="prop"></div></div></body>',
            output: '<body><div><div my-prop="prop"></div></div></body>',
            errors: [
                {
                    message: "Attribute `MY-PROP` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code:
                "<body><div><div MY-PROP<%='-JS'%>=\"prop\"></div></div></body>",
            output: null,
            errors: [
                {
                    message: "Attribute `MY-PROP` must be 'kebab-case'.",
                    type: "HTMLIdentifier",
                    line: 1,
                },
            ],
        },
        {
            filename: "test.html",
            code:
                "<body><div><div DATA-ID ARIA-TEST MY-PROP></div></div></body>",
            output:
                "<body><div><div data-id aria-test my-prop></div></div></body>",
            errors: [
                "Attribute `DATA-ID` must be 'kebab-case'.",
                "Attribute `ARIA-TEST` must be 'kebab-case'.",
                "Attribute `MY-PROP` must be 'kebab-case'.",
            ],
        },
    ],
})
