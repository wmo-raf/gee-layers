module.exports = {
  logger: {
    name: "eahw-analysis-gee",
    level: "debug",
    toFile: false,
    dirLogFile: null,
  },
  gee: {
    private_key_path: process.env.GEE_PRIVATE_KEY_PATH,
  },
  port: process.env.PORT,
  geostoreUrl: process.env.GEOSTORE_URL,
};
