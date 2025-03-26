import{_ as h,C as p,c as k,o,am as l,j as i,G as e,w as t,a}from"./chunks/framework.BREIZgL0.js";const T=JSON.parse(`{"title":"lodash-template/html-closing-bracket-newline","description":"require or disallow a line break before tag's closing brackets","frontmatter":{"pageClass":"rule-details","sidebarDepth":0,"title":"lodash-template/html-closing-bracket-newline","description":"require or disallow a line break before tag's closing brackets"},"headers":[],"relativePath":"rules/html-closing-bracket-newline.md","filePath":"rules/html-closing-bracket-newline.md","lastUpdated":1742963759000}`),r={name:"rules/html-closing-bracket-newline.md"},d={class:"language-html vp-adaptive-theme"},E={class:"shiki shiki-themes github-light github-dark vp-code twoslash lsp",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabindex:"0"},g={class:"line"},u={class:"line"},y={class:"line"},c={class:"language-html vp-adaptive-theme"},b={class:"shiki shiki-themes github-light github-dark vp-code twoslash lsp",style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8","--shiki-light-bg":"#fff","--shiki-dark-bg":"#24292e"},tabindex:"0"},m={class:"line"},F={class:"line"};function q(f,s,C,v,_,w){const n=p("v-menu");return o(),k("div",null,[s[34]||(s[34]=l(`<h1 id="lodash-template-html-closing-bracket-newline" tabindex="-1">lodash-template/html-closing-bracket-newline <a class="header-anchor" href="#lodash-template-html-closing-bracket-newline" aria-label="Permalink to &quot;lodash-template/html-closing-bracket-newline&quot;">​</a></h1><blockquote><p>require or disallow a line break before tag&#39;s closing brackets</p></blockquote><ul><li>⚙️ This rule is included in <code>&quot;plugin:lodash-template/recommended-with-html&quot;</code> and <code>&quot;plugin:lodash-template/all&quot;</code>.</li><li>🔧 The <code>--fix</code> option on the <a href="https://eslint.org/docs/user-guide/command-line-interface#fixing-problems" target="_blank" rel="noreferrer">command line</a> can automatically fix some of the problems reported by this rule.</li></ul><h2 id="rule-details" tabindex="-1">Rule Details <a class="header-anchor" href="#rule-details" aria-label="Permalink to &quot;Rule Details&quot;">​</a></h2><p>People have own preference about the location of closing brackets. This rule enforces a line break (or no line break) before tag&#39;s closing brackets.</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- On the same line with the last attribute. --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- On the next line. --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div>`,6)),i("div",d,[s[17]||(s[17]=i("button",{title:"Copy Code",class:"copy"},null,-1)),s[18]||(s[18]=i("span",{class:"lang"},"html",-1)),i("pre",E,[i("code",null,[s[13]||(s[13]=l(`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;%</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> /* eslint &quot;lodash-template/html-closing-bracket-newline&quot;: &quot;error&quot; */ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">%&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- ✓ GOOD --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- ✗ BAD --&gt;</span></span>
`,16)),i("span",g,[s[2]||(s[2]=l('<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span>',8)),e(n,{class:"twoslash-error twoslash-error-hover","popper-class":"shiki twoslash-floating vp-copy-ignore vp-code",theme:"twoslash"},{popper:t(({})=>s[0]||(s[0]=[i("span",{class:"twoslash-popup-container vp-copy-ignore"},[i("div",{class:"twoslash-popup-error vp-doc"},[i("p",null,[a("Expected no line breaks before closing bracket, but 1 line break found. ("),i("a",{href:"https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-closing-bracket-newline.html"},"lodash-template/html-closing-bracket-newline"),a(")")])])],-1)])),default:t(()=>[s[1]||(s[1]=i("span",null,[i("span")],-1))]),_:1})]),s[14]||(s[14]=l(`
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
`,7)),i("span",u,[s[5]||(s[5]=i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"  class",-1)),s[6]||(s[6]=i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"=",-1)),s[7]||(s[7]=i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"bar"',-1)),e(n,{class:"twoslash-error twoslash-error-hover","popper-class":"shiki twoslash-floating vp-copy-ignore vp-code",theme:"twoslash"},{popper:t(({})=>s[3]||(s[3]=[i("span",{class:"twoslash-popup-container vp-copy-ignore"},[i("div",{class:"twoslash-popup-error vp-doc"},[i("p",null,[a("Expected no line breaks before closing bracket, but 1 line break found. ("),i("a",{href:"https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-closing-bracket-newline.html"},"lodash-template/html-closing-bracket-newline"),a(")")])])],-1)])),default:t(()=>[s[4]||(s[4]=i("span",null,[i("span")],-1))]),_:1})]),s[15]||(s[15]=l(`
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
`,7)),i("span",y,[s[10]||(s[10]=i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"  class",-1)),s[11]||(s[11]=i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"=",-1)),s[12]||(s[12]=i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"bar"',-1)),e(n,{class:"twoslash-error twoslash-error-hover","popper-class":"shiki twoslash-floating vp-copy-ignore vp-code",theme:"twoslash"},{popper:t(({})=>s[8]||(s[8]=[i("span",{class:"twoslash-popup-container vp-copy-ignore"},[i("div",{class:"twoslash-popup-error vp-doc"},[i("p",null,[a("Expected no line breaks before closing bracket, but 1 line break found. ("),i("a",{href:"https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-closing-bracket-newline.html"},"lodash-template/html-closing-bracket-newline"),a(")")])])],-1)])),default:t(()=>[s[9]||(s[9]=i("span",null,[i("span")],-1))]),_:1})]),s[16]||(s[16]=l(`
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>`,2))])])]),s[35]||(s[35]=l(`<h2 id="options" tabindex="-1">Options <a class="header-anchor" href="#options" aria-label="Permalink to &quot;Options&quot;">​</a></h2><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;lodash-template/html-closing-bracket-newline&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;error&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;singleline&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;never&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;multiline&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;never&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><ul><li><code>singleline</code> ... the configuration for single-line elements. It&#39;s a single-line element if the element does not have attributes or the last attribute is on the same line as the opening bracket. <ul><li><code>&quot;never&quot;</code> ... disallow line breaks before the closing bracket. This is the default.</li><li><code>&quot;always&quot;</code> ... require one line break before the closing bracket.</li></ul></li><li><code>multiline</code> ... the configuration for multiline elements. It&#39;s a multiline element if the last attribute is not on the same line of the opening bracket. <ul><li><code>&quot;never&quot;</code> ... disallow line breaks before the closing bracket. This is the default.</li><li><code>&quot;always&quot;</code> ... require one line break before the closing bracket.</li></ul></li></ul><p>Plus, you can use <a href="./html-indent.html"><code>lodash-template/html-indent</code></a> rule to enforce indent-level of the closing brackets.</p><h3 id="examples-for-this-rule-with-multiline-always-option" tabindex="-1">Examples for this rule with <code>{ &quot;multiline&quot;: &quot;always&quot; }</code> option: <a class="header-anchor" href="#examples-for-this-rule-with-multiline-always-option" aria-label="Permalink to &quot;Examples for this rule with \`{ &quot;multiline&quot;: &quot;always&quot; }\` option:&quot;">​</a></h3>`,5)),i("div",c,[s[32]||(s[32]=i("button",{title:"Copy Code",class:"copy"},null,-1)),s[33]||(s[33]=i("span",{class:"lang"},"html",-1)),i("pre",b,[i("code",null,[s[30]||(s[30]=l(`<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;%</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> /* eslint &quot;lodash-template/html-closing-bracket-newline&quot;: [&quot;error&quot;, { &quot;multiline&quot;: &quot;always&quot; }] */ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">%&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- ✓ GOOD --&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  &gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">&lt;!-- ✗ BAD --&gt;</span></span>
`,26)),i("span",m,[s[21]||(s[21]=l('<span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;bar&quot;</span>',8)),e(n,{class:"twoslash-error twoslash-error-hover","popper-class":"shiki twoslash-floating vp-copy-ignore vp-code",theme:"twoslash"},{popper:t(({})=>s[19]||(s[19]=[i("span",{class:"twoslash-popup-container vp-copy-ignore"},[i("div",{class:"twoslash-popup-error vp-doc"},[i("p",null,[a("Expected no line breaks before closing bracket, but 1 line break found. ("),i("a",{href:"https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-closing-bracket-newline.html"},"lodash-template/html-closing-bracket-newline"),a(")")])])],-1)])),default:t(()=>[s[20]||(s[20]=i("span",null,[i("span")],-1))]),_:1})]),s[31]||(s[31]=l(`
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;foo&quot;</span></span>
`,7)),i("span",F,[s[24]||(s[24]=i("span",{style:{"--shiki-light":"#6F42C1","--shiki-dark":"#B392F0"}},"  class",-1)),s[25]||(s[25]=i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"=",-1)),s[26]||(s[26]=i("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},'"bar"',-1)),e(n,{class:"twoslash-error twoslash-error-hover","popper-class":"shiki twoslash-floating vp-copy-ignore vp-code",theme:"twoslash"},{popper:t(({})=>s[22]||(s[22]=[i("span",{class:"twoslash-popup-container vp-copy-ignore"},[i("div",{class:"twoslash-popup-error vp-doc"},[i("p",null,[a("Expected 1 line break before closing bracket, but no line breaks found. ("),i("a",{href:"https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-closing-bracket-newline.html"},"lodash-template/html-closing-bracket-newline"),a(")")])])],-1)])),default:t(()=>[s[23]||(s[23]=i("span",null,[i("span")],-1))]),_:1}),s[27]||(s[27]=i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"></",-1)),s[28]||(s[28]=i("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"div",-1)),s[29]||(s[29]=i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},">",-1))])])])]),s[36]||(s[36]=i("h2",{id:"implementation",tabindex:"-1"},[a("Implementation "),i("a",{class:"header-anchor",href:"#implementation","aria-label":'Permalink to "Implementation"'},"​")],-1)),s[37]||(s[37]=i("ul",null,[i("li",null,[i("a",{href:"https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/lib/rules/html-closing-bracket-newline.js",target:"_blank",rel:"noreferrer"},"Rule source")]),i("li",null,[i("a",{href:"https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/master/tests/lib/rules/html-closing-bracket-newline.js",target:"_blank",rel:"noreferrer"},"Test source")])],-1))])}const D=h(r,[["render",q]]);export{T as __pageData,D as default};
