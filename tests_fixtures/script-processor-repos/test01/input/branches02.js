<% const useFoo = true %>
<% if (useFoo) { %>
import foo from "./foo";
<% } %>
console.log("main process");
<% if (!useFoo) { %>
console.log("unused foo");
const NUMBER = 2;
<% } else { %>
console.log(foo);
const NUMBER = 1;
<% } %>
console.log(NUMBER);
