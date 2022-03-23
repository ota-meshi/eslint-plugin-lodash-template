declare module 'foo' {
    <% if (suppress) { %>// eslint-disable-next-line no-shadow<% } %>
    interface Foo {
        bar: number;
    }
}
