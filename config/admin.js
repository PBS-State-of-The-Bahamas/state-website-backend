module.exports = ({ env }) => ({
  url: env(
    "ADMIN_URL",
    `http://${env("HOST", "localhost")}:${env.int("PORT", 1337)}/admin`
  ),
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
});
