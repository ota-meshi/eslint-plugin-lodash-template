<% if (x > 0 && y === 42) { %>
const a = 'x && y'
<% } %>

<% if (x <= 0) { %>
    console.log('!x');
<% } else { %>
    console.log(a);
<% } %>

<% if (Boolean(y!==42)) { %>
    console.log('!y');
<% } else { %>
    console.log(a);
<% } %>
