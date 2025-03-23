/* globals describe -- ignore */
"use strict";

const Linter = require("eslint").Linter;
const processor = require("../lib/processors/micro-template-processor");
const parser = require("../lib/parser/micro-template-eslint-parser");
const rules = require("../lib/utils/rules").rules;

const linter = new Linter();

const config = {
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: 2015,
        },
    },
    plugins: {
        "lodash-template": {
            rules: Object.fromEntries(
                rules.map((rule) => [rule.meta.docs.ruleName, rule]),
            ),
        },
    },
    rules: Object.fromEntries(
        rules.map((rule) => [rule.meta.docs.ruleId, "error"]),
    ),
};
const options = {
    filename: "test.html",
    preprocess: processor.preprocess,
    postprocess: processor.postprocess,
};
describe("speed test", () => {
    const code = `
<% /* global accounts, users */ %>
<!-- comment -->
<% accounts.forEach(({id, profile_image_url, from_user}, i) => { %>
<div id="<%= id %>" class="<%= (i % 2 == 1 ? ' even': '') %>">
  <div class="grid_1 alpha right">
    <img class="righted" src="<%= profile_image_url %>"/>
  </div>
  <div class="grid_6 omega contents">
    <p><b><a href="/<%= from_user %>"><%= from_user %></a>:</b> <%= text %></p>
  </div>
</div>
<% }) %>

<% for ( var i = 0; i < users.length; i++ ) { %>
  <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
<% } %>
`;
    console.log("start"); // eslint-disable-line no-console -- ignore
    for (let i = 0; i < 5; i++) {
        console.time("time"); // eslint-disable-line no-console -- ignore
        for (let j = 0; j < 100; j++) {
            linter.verify(code, config, options);
        }
        console.timeEnd("time"); // eslint-disable-line no-console -- ignore
    }
});
