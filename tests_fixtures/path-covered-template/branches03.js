<% if (x && y) { %>
const a = 'x && y'
<% } %>

<% if (x) { %>
    <% if (y) { %>
        console.log(a);
    <% } else { %>
        console.log('!y');
    <% } %>
<% } else { %>
    console.log('!x');
<% } %>
