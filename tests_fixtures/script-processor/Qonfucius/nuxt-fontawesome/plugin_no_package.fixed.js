import Vue from 'vue'; // eslint-disable-line
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

<% options.packs.forEach(({ package_, icons }) => { %>
  <% if (icons) { %>
    <% icons.forEach((icon) => { %>
      import { <%= icon %> } from '<%= package_ %>';
    <% }) %>
  <% } else { %>
    import <%= package_.split(/[\s\/]+/)[1].replace(/-/g, '') %> from '<%= package_ %>';
  <% } %>
<% }) %>

config.autoAddCss = false;

<% options.packs.forEach(({ package_, icons }) => { %>
<% if (icons) { %>
    library.add(<%= icons.join(',') %>);
  <% } else { %>
    library.add(<%= package_.split(/[\s\/]+/)[1].replace(/-/g, '') %>);
  <% } %>
<% }) %>

Vue.component('<%= options.componentName %>', FontAwesomeIcon);
