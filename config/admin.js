module.exports = ({ env }) => ({
  url: env(
    "ADMIN_URL",
    `http://${env("STRAPI_HOST", "0.0.0.0")}:${env.int(
      "STRAPI_PORT",
      1337
    )}/admin`
  ),
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
});
