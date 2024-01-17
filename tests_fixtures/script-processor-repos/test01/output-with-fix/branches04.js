<% if (x && y) { %>
const a = 'x && y'
<% } %>

<% if (!x) { %>
console.log('!x');
<% } else { %>
console.log(a);
<% } %>

<% if (!y) { %>
console.log('!y');
<% } else { %>
console.log(a);
<% } %>
