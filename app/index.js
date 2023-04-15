const fs = require("fs");
// const config = require("config");
const ee = require("@google/earthengine");

require("dotenv").config({ silent: true }); // NOTE: make sure dot env is loaded first

const GEE_PRIVATE_KEY_PATH = process.env.GEE_PRIVATE_KEY_PATH;

const logger = require("logger");

fs.readFile(GEE_PRIVATE_KEY_PATH, "utf8", (err, data) => {
  if (err) {
    throw ("Error reading ee private key:", err);
  }
  try {
    const eeKey = JSON.parse(data);
    // authenticate google earth engine
    ee.data.authenticateViaPrivateKey(
      eeKey,
      function (res) {
        // initialize ee
        ee.initialize();

        // run app
        require("app")().then(
          () => {
            logger.info("Server running");
          },
          (err) => {
            logger.error("Error running server", err);
          }
        );
      },
      function (e) {
        throw e;
      }
    );
  } catch (err) {
    throw err;
  }
});
