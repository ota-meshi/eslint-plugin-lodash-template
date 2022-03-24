<% if (x in z && y === 42) { %>
const a = 'x in z && y === 42'
<% } %>

<% if (x in z) { %>
    console.log(a);
<% } else { %>
    console.log('not x in z');
<% } %>

<% if (z in x) { %>
    console.log('z in x');
<% } else { %>
    console.log("not z in x");
<% } %>

<% if ((42!==y)) { %>
    console.log('42!==y');
<% } else { %>
    console.log(a);
<% } %>
