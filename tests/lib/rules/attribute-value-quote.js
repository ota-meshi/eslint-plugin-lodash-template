"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/attribute-value-quote");

const tester = new RuleTester({
    languageOptions: {
        parser: require("../../../lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("attribute-value-quote", rule, {
    valid: [
        {
            filename: "test.html",
            code: "",
        },
        {
            filename: "test.html",
            code: '<body><div class="foo"></div></body>',
        },
        {
            filename: "test.html",
            code: '<body><div class="foo"></div></body>',
            options: ["double"],
        },
        {
            filename: "test.html",
            code: "<body><div class='foo'></div></body>",
            options: ["single"],
        },
        {
            filename: "test.html",
            code: "<body><div class='foo'></div><div class=\"foo\"></div></body>",
            options: ["either"],
        },
        {
            filename: "test.html",
            code: "<body><a download>download</a></body>",
        },
        { filename: "test.html", code: "<body><div class=></div></body>" },
        { filename: "test.html", code: "<body><div class=  ></div></body>" },
        {
            filename: "test.html",
            code: "<body><div class <%= '' %>  ></div></body>",
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: "<body><div class=foo></div></body>",
            output: '<body><div class="foo"></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class='foo'></div></body>",
            output: '<body><div class="foo"></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: '<body><div class=foo+"bar"></div></body>',
            output: "<body><div class='foo+\"bar\"'></div></body>",
            errors: ["Expected to be enclosed by single quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class='<%=foo+\"bar\"%>'></div></body>",
            output: null,
            errors: ["Expected to be enclosed by double quotes."],
        },

        {
            filename: "test.html",
            code: "<body><div class=foo></div></body>",
            output: '<body><div class="foo"></div></body>',
            options: ["double"],
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class='foo'></div></body>",
            output: '<body><div class="foo"></div></body>',
            options: ["double"],
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: '<body><div class=foo+"bar"></div></body>',
            output: '<body><div class="foo+&quot;bar&quot;"></div></body>',
            options: ["double"],
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: '<body><div class=<%=foo+"bar"%>a ></div></body>',
            output: null,
            options: ["double"],
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: '<body><div class=<%=foo+"bar"%>></div></body>',
            output: null,
            options: ["double"],
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class=foo></div></body>",
            output: "<body><div class='foo'></div></body>",
            options: ["single"],
            errors: ["Expected to be enclosed by single quotes."],
        },
        {
            filename: "test.html",
            code: '<body><div class="foo"></div></body>',
            output: "<body><div class='foo'></div></body>",
            options: ["single"],
            errors: ["Expected to be enclosed by single quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class=foo+'bar'></div></body>",
            output: "<body><div class='foo+&apos;bar&apos;'></div></body>",
            options: ["single"],
            errors: ["Expected to be enclosed by single quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class=\"<%=foo+'bar'%>\" ></div></body>",
            output: null,
            options: ["single"],
            errors: ["Expected to be enclosed by single quotes."],
        },

        {
            filename: "test.html",
            code: "<body><div class=foo></div></body>",
            output: '<body><div class="foo"></div></body>',
            options: ["either"],
            errors: ["Expected to be enclosed by quotes."],
        },
        {
            filename: "test.html",
            code: '<body><div class=foo+"bar"></div></body>',
            output: '<body><div class="foo+&quot;bar&quot;"></div></body>',
            options: ["either"],
            errors: ["Expected to be enclosed by quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div class =    v ></div></body>",
            output: '<body><div class =    "v" ></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div a b = = = = ></div></body>",
            output: '<body><div a b = "=" = = ></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            filename: "test.html",
            code: "<body><div = = = ></div></body>",
            output: '<body><div = = "=" ></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            // duplicate
            filename: "test.html",
            code: "<body><div a = v a = ></div></body>",
            output: '<body><div a = "v" a = ></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
        {
            // duplicate
            filename: "test.html",
            code: '<body><div a = "" a = v ></div></body>',
            output: '<body><div a = "" a = "v" ></div></body>',
            errors: ["Expected to be enclosed by double quotes."],
        },
    ],
});
