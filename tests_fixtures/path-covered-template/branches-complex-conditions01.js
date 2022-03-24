<% if (x > 0 && y === 42) { %>
const a = 'x && y'
<% } %>

<% if (0 >= x) { %>
    console.log('!x');
<% } else { %>
    console.log(a);
<% } %>

<% if ((42!==y)) { %>
    console.log('!y');
<% } else { %>
    console.log(a);
<% } %>
