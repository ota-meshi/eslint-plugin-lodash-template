<% const useFoo = true %>
<% if (useFoo) { %>
import foo from "./foo";
<% } %>
console.log("main process");
<% if (useFoo) { %>
console.log(foo);
const NUMBER = 1;
<% } else { %>
console.log("unused foo");
const NUMBER = 2;
<% } %>
console.log(NUMBER);
