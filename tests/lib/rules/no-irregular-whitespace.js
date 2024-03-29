"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/no-irregular-whitespace");

const tester = new RuleTester({
    languageOptions: {
        parser: require("../../../lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("no-irregular-whitespace", rule, {
    valid: [
        '<div attr = " " > <!-- --> </div >',
        '<div\nattr\n=\n"\n"\n>\n<!--\n-->\n</div\n>',

        "<% `\u000B` %><%= `\u000B` %>000B",
        "<% `\u000C` %><%= `\u000C` %>000C",
        "<% `\u0085` %><%= `\u0085` %>0085",
        "<% `\u00A0` %><%= `\u00A0` %>00A0",
        "<% `\u180E` %><%= `\u180E` %>180E",
        "<% `\uFEFF` %><%= `\uFEFF` %>FEFF",
        "<% `\u2000` %><%= `\u2000` %>2000",
        "<% `\u2001` %><%= `\u2001` %>2001",
        "<% `\u2002` %><%= `\u2002` %>2002",
        "<% `\u2003` %><%= `\u2003` %>2003",
        "<% `\u2004` %><%= `\u2004` %>2004",
        "<% `\u2005` %><%= `\u2005` %>2005",
        "<% `\u2006` %><%= `\u2006` %>2006",
        "<% `\u2007` %><%= `\u2007` %>2007",
        "<% `\u2008` %><%= `\u2008` %>2008",
        "<% `\u2009` %><%= `\u2009` %>2009",
        "<% `\u200A` %><%= `\u200A` %>200A",
        "<% `\u200B` %><%= `\u200B` %>200B",
        "<% `\u2028` %><%= `\u2028` %>2028",
        "<% `\u2029` %><%= `\u2029` %>2029",
        "<% `\u202F` %><%= `\u202F` %>202F",
        "<% `\u205F` %><%= `\u205F` %>205F",
        "<% `\u3000` %><%= `\u3000` %>3000",

        { code: "<!-- \u000B -->000B", options: [{ skipComments: true }] },
        { code: "<!-- \u000C -->000C", options: [{ skipComments: true }] },
        { code: "<!-- \u0085 -->0085", options: [{ skipComments: true }] },
        { code: "<!-- \u00A0 -->00A0", options: [{ skipComments: true }] },
        { code: "<!-- \u180E -->180E", options: [{ skipComments: true }] },
        { code: "<!-- \uFEFF -->FEFF", options: [{ skipComments: true }] },
        { code: "<!-- \u2000 -->2000", options: [{ skipComments: true }] },
        { code: "<!-- \u2001 -->2001", options: [{ skipComments: true }] },
        { code: "<!-- \u2002 -->2002", options: [{ skipComments: true }] },
        { code: "<!-- \u2003 -->2003", options: [{ skipComments: true }] },
        { code: "<!-- \u2004 -->2004", options: [{ skipComments: true }] },
        { code: "<!-- \u2005 -->2005", options: [{ skipComments: true }] },
        { code: "<!-- \u2006 -->2006", options: [{ skipComments: true }] },
        { code: "<!-- \u2007 -->2007", options: [{ skipComments: true }] },
        { code: "<!-- \u2008 -->2008", options: [{ skipComments: true }] },
        { code: "<!-- \u2009 -->2009", options: [{ skipComments: true }] },
        { code: "<!-- \u200A -->200A", options: [{ skipComments: true }] },
        { code: "<!-- \u200B -->200B", options: [{ skipComments: true }] },
        { code: "<!-- \u2028 -->2028", options: [{ skipComments: true }] },
        { code: "<!-- \u2029 -->2029", options: [{ skipComments: true }] },
        { code: "<!-- \u202F -->202F", options: [{ skipComments: true }] },
        { code: "<!-- \u205F -->205F", options: [{ skipComments: true }] },
        { code: "<!-- \u3000 -->3000", options: [{ skipComments: true }] },

        {
            code: '<div attr=" \u000B " >000B</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u000C " >000C</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u0085 " >0085</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u00A0 " >00A0</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u180E " >180E</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \uFEFF " >FEFF</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2000 " >2000</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2001 " >2001</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2002 " >2002</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2003 " >2003</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2004 " >2004</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2005 " >2005</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2006 " >2006</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2007 " >2007</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2008 " >2008</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2009 " >2009</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u200A " >200A</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u200B " >200B</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2028 " >2028</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u2029 " >2029</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u202F " >202F</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u205F " >205F</div>',
            options: [{ skipAttrValues: true }],
        },
        {
            code: '<div attr=" \u3000 " >3000</div>',
            options: [{ skipAttrValues: true }],
        },

        { code: "<div> \u000B </div>000B", options: [{ skipText: true }] },
        { code: "<div> \u000C </div>000C", options: [{ skipText: true }] },
        { code: "<div> \u0085 </div>0085", options: [{ skipText: true }] },
        { code: "<div> \u00A0 </div>00A0", options: [{ skipText: true }] },
        { code: "<div> \u180E </div>180E", options: [{ skipText: true }] },
        { code: "<div> \uFEFF </div>FEFF", options: [{ skipText: true }] },
        { code: "<div> \u2000 </div>2000", options: [{ skipText: true }] },
        { code: "<div> \u2001 </div>2001", options: [{ skipText: true }] },
        { code: "<div> \u2002 </div>2002", options: [{ skipText: true }] },
        { code: "<div> \u2003 </div>2003", options: [{ skipText: true }] },
        { code: "<div> \u2004 </div>2004", options: [{ skipText: true }] },
        { code: "<div> \u2005 </div>2005", options: [{ skipText: true }] },
        { code: "<div> \u2006 </div>2006", options: [{ skipText: true }] },
        { code: "<div> \u2007 </div>2007", options: [{ skipText: true }] },
        { code: "<div> \u2008 </div>2008", options: [{ skipText: true }] },
        { code: "<div> \u2009 </div>2009", options: [{ skipText: true }] },
        { code: "<div> \u200A </div>200A", options: [{ skipText: true }] },
        { code: "<div> \u200B </div>200B", options: [{ skipText: true }] },
        { code: "<div> \u2028 </div>2028", options: [{ skipText: true }] },
        { code: "<div> \u2029 </div>2029", options: [{ skipText: true }] },
        { code: "<div> \u202F </div>202F", options: [{ skipText: true }] },
        { code: "<div> \u205F </div>205F", options: [{ skipText: true }] },
        { code: "<div> \u3000 </div>3000", options: [{ skipText: true }] },
    ],
    invalid: [
        {
            code: '<div\u000B attr="\u000B" attr="\u000B" \u000Battr="" > \u000B <!-- \u000B --></div\u000B > 000B',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 000B',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u000B' not allowed.",
            ),
        },
        {
            code: '<div\u000C attr="\u000C" attr="\u000C" \u000Cattr="" > \u000C <!-- \u000C --></div\u000C > 000C',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 000C',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u000C' not allowed.",
            ),
        },
        {
            code: '<div\u0085 attr="\u0085" attr="\u0085" \u0085attr="" > \u0085 <!-- \u0085 --></div\u0085 > 0085',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 0085',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u0085' not allowed.",
            ),
        },
        {
            code: '<div\u00A0 attr="\u00A0" attr="\u00A0" \u00A0attr="" > \u00A0 <!-- \u00A0 --></div\u00A0 > 00A0',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 00A0',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u00A0' not allowed.",
            ),
        },
        {
            code: '<div\u180E attr="\u180E" attr="\u180E" \u180Eattr="" > \u180E <!-- \u180E --></div\u180E > 180E',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 180E',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u180E' not allowed.",
            ),
        },
        {
            code: '<div\uFEFF attr="\uFEFF" attr="\uFEFF" \uFEFFattr="" > \uFEFF <!-- \uFEFF --></div\uFEFF > FEFF',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > FEFF',
            errors: new Array(7).fill(
                "Irregular whitespace '\\uFEFF' not allowed.",
            ),
        },
        {
            code: '<div\u2000 attr="\u2000" attr="\u2000" \u2000attr="" > \u2000 <!-- \u2000 --></div\u2000 > 2000',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2000',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2000' not allowed.",
            ),
        },
        {
            code: '<div\u2001 attr="\u2001" attr="\u2001" \u2001attr="" > \u2001 <!-- \u2001 --></div\u2001 > 2001',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2001',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2001' not allowed.",
            ),
        },
        {
            code: '<div\u2002 attr="\u2002" attr="\u2002" \u2002attr="" > \u2002 <!-- \u2002 --></div\u2002 > 2002',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2002',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2002' not allowed.",
            ),
        },
        {
            code: '<div\u2003 attr="\u2003" attr="\u2003" \u2003attr="" > \u2003 <!-- \u2003 --></div\u2003 > 2003',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2003',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2003' not allowed.",
            ),
        },
        {
            code: '<div\u2004 attr="\u2004" attr="\u2004" \u2004attr="" > \u2004 <!-- \u2004 --></div\u2004 > 2004',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2004',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2004' not allowed.",
            ),
        },
        {
            code: '<div\u2005 attr="\u2005" attr="\u2005" \u2005attr="" > \u2005 <!-- \u2005 --></div\u2005 > 2005',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2005',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2005' not allowed.",
            ),
        },
        {
            code: '<div\u2006 attr="\u2006" attr="\u2006" \u2006attr="" > \u2006 <!-- \u2006 --></div\u2006 > 2006',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2006',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2006' not allowed.",
            ),
        },
        {
            code: '<div\u2007 attr="\u2007" attr="\u2007" \u2007attr="" > \u2007 <!-- \u2007 --></div\u2007 > 2007',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2007',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2007' not allowed.",
            ),
        },
        {
            code: '<div\u2008 attr="\u2008" attr="\u2008" \u2008attr="" > \u2008 <!-- \u2008 --></div\u2008 > 2008',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2008',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2008' not allowed.",
            ),
        },
        {
            code: '<div\u2009 attr="\u2009" attr="\u2009" \u2009attr="" > \u2009 <!-- \u2009 --></div\u2009 > 2009',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 2009',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2009' not allowed.",
            ),
        },
        {
            code: '<div\u200A attr="\u200A" attr="\u200A" \u200Aattr="" > \u200A <!-- \u200A --></div\u200A > 200A',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 200A',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u200A' not allowed.",
            ),
        },
        {
            code: '<div\u200B attr="\u200B" attr="\u200B" \u200Battr="" > \u200B <!-- \u200B --></div\u200B > 200B',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 200B',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u200B' not allowed.",
            ),
        },
        {
            code: '<div\u2028 attr="\u2028" attr="\u2028" \u2028attr="" > \u2028 <!-- \u2028 --></div\u2028 > 2028',
            output: '<div\n attr="\n" attr="\n" \nattr="" > \n <!-- \n --></div\n > 2028',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2028' not allowed.",
            ),
        },
        {
            code: '<div\u2029 attr="\u2029" attr="\u2029" \u2029attr="" > \u2029 <!-- \u2029 --></div\u2029 > 2029',
            output: '<div\n attr="\n" attr="\n" \nattr="" > \n <!-- \n --></div\n > 2029',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u2029' not allowed.",
            ),
        },
        {
            code: '<div\u202F attr="\u202F" attr="\u202F" \u202Fattr="" > \u202F <!-- \u202F --></div\u202F > 202F',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 202F',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u202F' not allowed.",
            ),
        },
        {
            code: '<div\u205F attr="\u205F" attr="\u205F" \u205Fattr="" > \u205F <!-- \u205F --></div\u205F > 205F',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 205F',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u205F' not allowed.",
            ),
        },
        {
            code: '<div\u3000 attr="\u3000" attr="\u3000" \u3000attr="" > \u3000 <!-- \u3000 --></div\u3000 > 3000',
            output: '<div  attr=" " attr=" "  attr="" >   <!--   --></div  > 3000',
            errors: new Array(7).fill(
                "Irregular whitespace '\\u3000' not allowed.",
            ),
        },

        {
            code: '<div\u3000 attr="\u3000" attr="\u3000" \u3000attr="" > \u3000 <!-- \u3000 --></div\u3000 >',
            output: '<div  attr="\u3000" attr="\u3000"  attr="" >   <!--   --></div  >',
            options: [{ skipAttrValues: true }],
            errors: new Array(5).fill(
                "Irregular whitespace '\\u3000' not allowed.",
            ),
        },
        {
            code: '<div\u3000 attr="\u3000" attr="\u3000" \u3000attr="" > \u3000 <!-- \u3000 --></div\u3000 >',
            output: '<div  attr=" " attr=" "  attr="" > \u3000 <!--   --></div  >',
            options: [{ skipText: true }],
            errors: new Array(6).fill(
                "Irregular whitespace '\\u3000' not allowed.",
            ),
        },
        {
            code: '<div\u3000 attr="\u3000" attr="\u3000" \u3000attr="" > \u3000 <!-- \u3000 --></div\u3000 >',
            output: '<div  attr=" " attr=" "  attr="" >   <!-- \u3000 --></div  >',
            options: [{ skipComments: true }],
            errors: new Array(6).fill(
                "Irregular whitespace '\\u3000' not allowed.",
            ),
        },
        {
            code: '<div\u3000 attr="\u3000" attr="\u3000" \u3000attr="" > \u3000 <!-- \u3000 --></div\u3000 >',
            output: '<div  attr="\u3000" attr="\u3000"  attr="" > \u3000 <!-- \u3000 --></div  >',
            options: [
                { skipComments: true, skipAttrValues: true, skipText: true },
            ],
            errors: new Array(3).fill(
                "Irregular whitespace '\\u3000' not allowed.",
            ),
        },
    ],
});
