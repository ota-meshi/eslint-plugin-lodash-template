<% if (x > 0 && y === 42) { %>
const a = 'x > 0 && y === 42'
<% } %>

<% if (x <= 0) { %>
    console.log('x <= 0');
<% } else { %>
    console.log(a);
<% } %>

<% if (Boolean(y!==42)) { %>
    console.log('Boolean(y!==42)');
<% } else { %>
    console.log(a);
<% } %>
