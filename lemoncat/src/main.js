/* eslint-disable */
import Vue from "vue";
import VueApollo from "vue-apollo";

import App from "./App";
import router from "./router";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.use(VueApollo);

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "http://localhost:3841/graphql"
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  apolloClient,
  components: { App },
  template: "<App/>"
});
