import Vue from 'vue'; // eslint-disable-line
import {config, library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

<% options.packs.forEach(({"package": pkg, icons}) => { %>
  <% if (icons) { %>
    <% icons.forEach((icon) => { %>
import {<%= icon %>} from '<%= pkg %>';
    <% }) %>
  <% } else { %>
import <%= pkg.split(/[\s\/]+/)[1].replace(
    /-/g,
    ""
  ) %> from '<%= pkg %>';
  <% } %>
<% }) %>

config.autoAddCss = false;

<% options.packs.forEach(({"package": pkg, icons}) => { %>
<% if (icons) { %>
library.add(<%= icons.join(',') %>);
  <% } else { %>
library.add(<%= pkg.split(/[\s\/]+/)[1].replace(
    /-/g,
    ""
  ) %>);
  <% } %>
<% }) %>

Vue.component(
'<%= options.componentName %>',
    FontAwesomeIcon
);
