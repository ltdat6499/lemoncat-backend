const NodeAcl = require("acl");
const acl = new NodeAcl(new NodeAcl.memoryBackend(), {
  debug: (msg) => {
    console.log("-DEBUG-", msg);
  },
});

acl.allow([
  {
    roles: "s-admin",
    allows: [
      {
        resources: "users",
        permissions: "delete",
      },
    ],
  },
  {
    roles: "admin",
    allows: [
      {
        resources: "movies",
        permissions: "*",
      },
      {
        resources: "persons",
        permissions: "*",
      },
      {
        resources: "productions",
        permissions: "*",
      },
      {
        resources: "tops",
        permissions: "*",
      },
      {
        resources: "category",
        permissions: "*",
      },
      {
        resources: "posts",
        permissions: "*",
      },
      {
        resources: "comments",
        permissions: "*",
      },
    ],
  },
  {
    roles: "s-user",
    allows: [
      {
        resources: "posts",
        permissions: "createSneakShow",
      },
    ],
  },
  {
    roles: "user",
    allows: [
      {
        resources: "categories",
        permissions: "get",
      },
      {
        resources: "tops",
        permissions: "get",
      },
      {
        resources: "productions",
        permissions: "get",
      },
      {
        resources: "posts",
        permissions: "create",
      },
      {
        resources: "posts",
        permissions: "update",
      },
      {
        resources: "posts",
        permissions: "delete",
      },
      {
        resources: "persons",
        permissions: "get",
      },
      {
        resources: "movies",
        permissions: "get",
      },
      {
        resources: "comments",
        permissions: "*",
      },
      {
        resources: "users",
        permissions: "get",
      },
    ],
  },
  {
    roles: "guest",
    allows: [
      {
        resources: "users",
        permissions: "create",
      },
      {
        resources: "users",
        permissions: "update",
      },
    ],
  },
]);

acl.addRoleParents("user", "guest");
acl.addRoleParents("s-user", "user");
acl.addRoleParents("admin", "s-user");
acl.addRoleParents("s-admin", "admin");

module.exports = acl;
