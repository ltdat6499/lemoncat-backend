module.exports = {
  client: {
    service: {
      name: "lemoncat",
      // URL to the GraphQL API
      url: "http://localhost:3841/graphql"
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"]
  }
};
