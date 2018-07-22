"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/max-attributes-per-line")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("max-attributes-per-line", rule, {
    valid: [
        {
            code: "<body><div></div></body>",
        },
        {
            code: `<body><div
                    name="John Doe"
                    age="30"
                    job="Vet"
                  ></div></body>`,
        },
        {
            code: `<body><div
                    name="John Doe"
                    age="30"
                    job="Vet"
                  ></div></body>`,
            options: [{ multiline: { allowFirstLine: true } }],
        },
        {
            code: `<body><div
                    name="John Doe"
                    age="30"
                  >
                  </div></body>`,
        },
        {
            code: `<body><div
                    name="John Doe"
                    age="30">
                  </div>
                  </body>`,
            options: [{ singleline: 1 }],
        },
        {
            code: "<body><div></div></body>",
            options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false } }],
        },
        {
            code: "<body><div name=\"John Doe\" age=\"30\" job=\"Vet\"></div></body>",
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
        },
        {
            code: `<body><div name="John Doe"
                    age="30">
                    </div>
                  </body>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: true } }],
        },
        {
            code: `<body><div
                    name="John Doe"
                    age="30">
                    </div>
                  </body>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
        },
        {
            code: `<body><div
                    name="John Doe" age="30"
                    job="Vet">
                    </div>
                  </body>`,
            options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false } }],
        },
    ],

    invalid: [
        {
            code: "<body><div name=\"John Doe\" age=\"30\"></div></body>",
            output: `<body><div name="John Doe" 
age="30"></div></body>`,
            errors: ["Attribute \"age\" should be on a new line."],
        },
        {
            code: `<body><div job="Vet"
                      name="John Doe"
                      age="30">
                      </div>
                    </body>`,
            output: `<body><div 
job="Vet"
                      name="John Doe"
                      age="30">
                      </div>
                    </body>`,
            errors: [{
                message: "Attribute \"job\" should be on a new line.",
                type: "HTMLAttribute",
                line: 1,
            }],
        },
        {
            code: "<body><div name=\"John Doe\" age=\"30\" job=\"Vet\"></div></body>",
            options: [{ singleline: { max: 2 } }],
            output: `<body><div name="John Doe" age="30" 
job="Vet"></div></body>`,
            errors: [{
                message: "Attribute \"job\" should be on a new line.",
                type: "HTMLAttribute",
                line: 1,
            }],
        },
        {
            code: "<body><div name=\"John Doe\" age=\"30\" job=\"Vet\"></div></body>",
            options: [{ singleline: 1, multiline: { max: 1, allowFirstLine: false } }],
            output: `<body><div name="John Doe" 
age="30" job="Vet"></div></body>`,
            errors: [{
                message: "Attribute \"age\" should be on a new line.",
                type: "HTMLAttribute",
                line: 1,
            }, {
                message: "Attribute \"job\" should be on a new line.",
                type: "HTMLAttribute",
                line: 1,
            }],
        },
        {
            code: `<body><div name="John Doe"
                      age="30">
                      </div>
                    </body>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
            output: `<body><div 
name="John Doe"
                      age="30">
                      </div>
                    </body>`,
            errors: [{
                message: "Attribute \"name\" should be on a new line.",
                type: "HTMLAttribute",
                line: 1,
            }],
        },
        {
            code: `<body><div
                      name="John Doe" age="30"
                      job="Vet">
                      </div>
                    </body>`,
            options: [{ singleline: 3, multiline: { max: 1, allowFirstLine: false } }],
            output: `<body><div
                      name="John Doe" 
age="30"
                      job="Vet">
                      </div>
                    </body>`,
            errors: [{
                message: "Attribute \"age\" should be on a new line.",
                type: "HTMLAttribute",
                line: 2,
            }],
        },
        {
            code: `<body><div
                      name="John Doe" age="30"
                      job="Vet">
                      </div>
                    </body>`,
            options: [{ singleline: 3, multiline: 1 }],
            output: `<body><div
                      name="John Doe" 
age="30"
                      job="Vet">
                      </div>
                    </body>`,
            errors: [{
                message: "Attribute \"age\" should be on a new line.",
                type: "HTMLAttribute",
                line: 2,
            }],
        },
        {
            code: `<body><div
                      name="John Doe" age="30"
                      job="Vet" pet="dog" petname="Snoopy">
                      </div>
                    </body>`,
            options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false } }],
            output: `<body><div
                      name="John Doe" age="30"
                      job="Vet" pet="dog" 
petname="Snoopy">
                      </div>
                    </body>`,
            errors: [{
                message: "Attribute \"petname\" should be on a new line.",
                type: "HTMLAttribute",
                line: 3,
            }],
        },
        {
            code: `<body><div
                      name="John Doe" age="30"
                      job="Vet" pet="dog" petname="Snoopy" extra="foo">
                      </div>
                    </body>`,
            options: [{ singleline: 3, multiline: { max: 2, allowFirstLine: false } }],
            output: `<body><div
                      name="John Doe" age="30"
                      job="Vet" pet="dog" 
petname="Snoopy" extra="foo">
                      </div>
                    </body>`,
            errors: [{
                message: "Attribute \"petname\" should be on a new line.",
                type: "HTMLAttribute",
                line: 3,
            }, {
                message: "Attribute \"extra\" should be on a new line.",
                type: "HTMLAttribute",
                line: 3,
            }],
        },
        {
            code: "<body><div name=\"John Doe\" age=\"30\" job=\"Vet\"></div></body>",
            options: [{ singleline: {} }],
            output: `<body><div name="John Doe" 
age="30" job="Vet"></div></body>`,
            errors: [
                "Attribute \"age\" should be on a new line.",
                "Attribute \"job\" should be on a new line.",
            ],
        },
    ],
})
