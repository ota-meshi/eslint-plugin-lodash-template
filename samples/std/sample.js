const obj   = <%= JSON.stringify(options) %>

<% for (const key of Object.  keys(additionals)) { %>
    obj[ <%= key %>] =<%= additionals[key] %>
<% } %>

export default obj
