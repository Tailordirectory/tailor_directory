module.exports = {
  path: [
    {
      url: "/",
      methods: ["GET"],
    },
    {
      url: "/auth/signin/refresh",
      methods: ["POST"],
    },
    {
      url: "/auth/signup",
      methods: ["POST"],
    },
    {
      url: "/auth/signup/tailor",
      methods: ["POST"],
    },
    {
      url: "/auth/signin",
      methods: ["POST"],
    },
    {
      url: "/auth/facebook",
      methods: ["POST"],
    },
    {
      url: "/auth/google",
      methods: ["POST"],
    },
    {
      url: "/auth/apple",
      methods: ["POST"],
    },
    {
      url: /^\/auth\/verify-email*/,
      methods: ["GET"],
    },
    {
      url: /^\/auth\/forgot-password*/,
      methods: ["GET", "POST"],
    },
    {
      url: "/devices/types",
      methods: ["GET"],
    },
    {
      url: "/business",
      methods: ["GET"],
    },
    {
      url: "/business/types",
      methods: ["GET"],
    },
    {
      url: "/business/another/:id",
      methods: ["GET"],
    },
    {
      url: "/business/:id",
      methods: ["GET"],
    },
    {
      url: "/tags",
      methods: ["GET"],
    },
    {
      url: "/i18n/en",
      methods: ["GET"],
    },
    {
      url: "/i18n/de",
      methods: ["GET"],
    },
    {
      url: /^\/one-time-pass\/me\/confirm-email*/,
      methods: ["GET"],
    },
    {
      url: /^\/one-time-pass\/confirm-email*/,
      methods: ["GET"],
    },
    {
      url: "/profiles/permissions",
      methods: ["GET"],
    },
    {
      url: "/admin/auth",
      methods: ["POST"],
    },
    {
      url: "/admin/auth/refresh",
      methods: ["POST"],
    },
  ],
};
