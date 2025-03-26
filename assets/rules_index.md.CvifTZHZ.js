import{_ as e,c as l,o as a,am as i}from"./chunks/framework.BREIZgL0.js";const g=JSON.parse('{"title":"All Rules","description":"","frontmatter":{"sidebarDepth":0},"headers":[],"relativePath":"rules/index.md","filePath":"rules/index.md","lastUpdated":1742963759000}'),s={name:"rules/index.md"};function n(d,t,o,r,h,p){return a(),l("div",null,t[0]||(t[0]=[i(`<h1 id="all-rules" tabindex="-1">All Rules <a class="header-anchor" href="#all-rules" aria-label="Permalink to &quot;All Rules&quot;">​</a></h1><h2 id="base-rules-enabling-correct-eslint-parsing" tabindex="-1">Base Rules (Enabling Correct ESLint Parsing) <a class="header-anchor" href="#base-rules-enabling-correct-eslint-parsing" aria-label="Permalink to &quot;Base Rules (Enabling Correct ESLint Parsing)&quot;">​</a></h2><p>Enable this plugin using with:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;extends&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;plugin:lodash-template/base&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th style="text-align:left;">Rule ID</th><th style="text-align:left;">Description</th><th style="text-align:left;"></th></tr></thead><tbody><tr><td style="text-align:left;"><a href="./no-script-parsing-error.html">lodash-template/no-script-parsing-error</a></td><td style="text-align:left;">disallow parsing errors in template</td><td style="text-align:left;"></td></tr></tbody></table><h2 id="best-practices-improve-development-experience" tabindex="-1">Best Practices (Improve Development Experience) <a class="header-anchor" href="#best-practices-improve-development-experience" aria-label="Permalink to &quot;Best Practices (Improve Development Experience)&quot;">​</a></h2><p>Enforce all the rules in this category with:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;extends&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;plugin:lodash-template/best-practices&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th style="text-align:left;">Rule ID</th><th style="text-align:left;">Description</th><th style="text-align:left;"></th></tr></thead><tbody><tr><td style="text-align:left;"><a href="./no-empty-template-tag.html">lodash-template/no-empty-template-tag</a></td><td style="text-align:left;">disallow empty micro-template tag. (ex. 🆖 <code>&lt;% %&gt;</code>)</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;"><a href="./no-invalid-template-interpolation.html">lodash-template/no-invalid-template-interpolation</a></td><td style="text-align:left;">disallow other than expression in micro-template interpolation. (ex. 🆖 <code>&lt;%= if (test) { %&gt;</code>)</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;"><a href="./no-semi-in-template-interpolation.html">lodash-template/no-semi-in-template-interpolation</a></td><td style="text-align:left;">disallow the semicolon at the end of expression in micro template interpolation.(ex. 🆗 <code>&lt;%= text %&gt;</code> 🆖 <code>&lt;%= text; %&gt;</code>)</td><td style="text-align:left;">🔧</td></tr></tbody></table><h2 id="recommended-improve-readability" tabindex="-1">Recommended (Improve Readability) <a class="header-anchor" href="#recommended-improve-readability" aria-label="Permalink to &quot;Recommended (Improve Readability)&quot;">​</a></h2><p>Enforce all the rules in this category and all the rules in <code>Best Practices</code> categories with:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;extends&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;plugin:lodash-template/recommended&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th style="text-align:left;">Rule ID</th><th style="text-align:left;">Description</th><th style="text-align:left;"></th></tr></thead><tbody><tr><td style="text-align:left;"><a href="./no-irregular-whitespace.html">lodash-template/no-irregular-whitespace</a></td><td style="text-align:left;">disallow irregular whitespace outside the template tags.</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./no-multi-spaces-in-scriptlet.html">lodash-template/no-multi-spaces-in-scriptlet</a></td><td style="text-align:left;">disallow multiple spaces in scriptlet. (ex. 🆖 <code>&lt;% if···(test)···{ %&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./scriptlet-indent.html">lodash-template/scriptlet-indent</a></td><td style="text-align:left;">enforce consistent indentation to scriptlet in micro-template tag.</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./template-tag-spacing.html">lodash-template/template-tag-spacing</a></td><td style="text-align:left;">enforce unified spacing in micro-template tag. (ex. 🆗 <code>&lt;%= prop %&gt;</code>, 🆖 <code>&lt;%=prop%&gt;</code>)</td><td style="text-align:left;">🔧</td></tr></tbody></table><h2 id="recommended-with-html-template-improve-readability-with-html-template" tabindex="-1">Recommended with HTML template (Improve Readability with HTML template) <a class="header-anchor" href="#recommended-with-html-template-improve-readability-with-html-template" aria-label="Permalink to &quot;Recommended with HTML template (Improve Readability with HTML template)&quot;">​</a></h2><p>Enforce all the rules in this category and all the rules in <code>Best Practices</code>/<code>Recommended</code> categories with:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;extends&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;plugin:lodash-template/recommended-with-html&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th style="text-align:left;">Rule ID</th><th style="text-align:left;">Description</th><th style="text-align:left;"></th></tr></thead><tbody><tr><td style="text-align:left;"><a href="./attribute-name-casing.html">lodash-template/attribute-name-casing</a></td><td style="text-align:left;">enforce HTML attribute name casing. (ex. 🆗 <code>&lt;div foo-bar&gt;</code> 🆖 <code>&lt;div fooBar&gt;</code> <code>&lt;div FOO-BAR&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./attribute-value-quote.html">lodash-template/attribute-value-quote</a></td><td style="text-align:left;">enforce quotes style of HTML attributes. (ex. 🆗 <code>&lt;div class=&quot;abc&quot;&gt;</code> 🆖 <code>&lt;div class=&#39;abc&#39;&gt;</code> <code>&lt;div class=abc&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./element-name-casing.html">lodash-template/element-name-casing</a></td><td style="text-align:left;">enforce HTML element name casing. (ex. 🆗 <code>&lt;xxx-element&gt;</code> 🆖 <code>&lt;xxxElement&gt;</code> <code>&lt;DIV&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./html-closing-bracket-newline.html">lodash-template/html-closing-bracket-newline</a></td><td style="text-align:left;">require or disallow a line break before tag&#39;s closing brackets</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./html-closing-bracket-spacing.html">lodash-template/html-closing-bracket-spacing</a></td><td style="text-align:left;">require or disallow a space before tag&#39;s closing brackets. (ex. 🆗 <code>&lt;input&gt;</code> <code>&lt;input·/&gt;</code> 🆖 <code>&lt;input·&gt;</code> <code>&lt;input/&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./html-comment-content-newline.html">lodash-template/html-comment-content-newline</a></td><td style="text-align:left;">require or disallow a line break before and after HTML comment contents</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./html-comment-spacing.html">lodash-template/html-comment-spacing</a></td><td style="text-align:left;">enforce unified spacing in HTML comment. (ex. 🆗 <code>&lt;!-- comment --&gt;</code>, 🆖 <code>&lt;!--comment--&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./html-content-newline.html">lodash-template/html-content-newline</a></td><td style="text-align:left;">require or disallow a line break before and after HTML contents</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./html-indent.html">lodash-template/html-indent</a></td><td style="text-align:left;">enforce consistent HTML indentation.</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./max-attributes-per-line.html">lodash-template/max-attributes-per-line</a></td><td style="text-align:left;">enforce the maximum number of HTML attributes per line</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./no-duplicate-attributes.html">lodash-template/no-duplicate-attributes</a></td><td style="text-align:left;">disallow duplication of HTML attributes. (ex. 🆖 <code>&lt;div foo foo&gt;</code>)</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;"><a href="./no-html-comments.html">lodash-template/no-html-comments</a></td><td style="text-align:left;">disallow HTML comments. (ex. 🆖 <code>&lt;!-- comment --&gt;</code>)</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;"><a href="./no-multi-spaces-in-html-tag.html">lodash-template/no-multi-spaces-in-html-tag</a></td><td style="text-align:left;">disallow multiple spaces in HTML tags. (ex. 🆖 <code>&lt;input···type=&quot;text&quot;&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./no-space-attribute-equal-sign.html">lodash-template/no-space-attribute-equal-sign</a></td><td style="text-align:left;">disallow spacing around equal signs in attribute. (ex. 🆗 <code>&lt;div class=&quot;item&quot;&gt;</code> 🆖 <code>&lt;div class = &quot;item&quot;&gt;</code>)</td><td style="text-align:left;">🔧</td></tr><tr><td style="text-align:left;"><a href="./no-warning-html-comments.html">lodash-template/no-warning-html-comments</a></td><td style="text-align:left;">disallow specified warning terms in HTML comments. (ex. 🆖 <code>&lt;!-- TODO:task --&gt;</code>)</td><td style="text-align:left;"></td></tr></tbody></table><h2 id="uncategorized" tabindex="-1">Uncategorized <a class="header-anchor" href="#uncategorized" aria-label="Permalink to &quot;Uncategorized&quot;">​</a></h2><p>No preset enables the rules in this category. Please enable each rule if you want.</p><p>For example:</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;rules&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;lodash-template/no-template-tag-in-start-tag&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;error&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><table tabindex="0"><thead><tr><th style="text-align:left;">Rule ID</th><th style="text-align:left;">Description</th><th style="text-align:left;"></th></tr></thead><tbody><tr><td style="text-align:left;"><a href="./no-template-tag-in-start-tag.html">lodash-template/no-template-tag-in-start-tag</a></td><td style="text-align:left;">disallow template tag in start tag outside attribute values. (ex. 🆖 <code>&lt;input &lt;%= &#39;disabled&#39; %&gt; &gt;</code>)</td><td style="text-align:left;"></td></tr><tr><td style="text-align:left;"><a href="./prefer-escape-template-interpolations.html">lodash-template/prefer-escape-template-interpolations</a></td><td style="text-align:left;">prefer escape micro-template interpolations. (ex. 🆗 <code>&lt;%- ... %&gt;</code>, 🆖 <code>&lt;%= ... %&gt;</code>)</td><td style="text-align:left;"></td></tr></tbody></table>`,22)]))}const m=e(s,[["render",n]]);export{g as __pageData,m as default};
