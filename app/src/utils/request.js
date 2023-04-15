const { create } = require("axios");

module.exports = create({
  timeout: 30 * 1000,
});
