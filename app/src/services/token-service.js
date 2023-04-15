const ee = require("@google/earthengine");
const request = require("utils/request");

class TokenService {
  static async getToken() {
    let token = ee.data.getAuthToken();

    if (!token) {
      ee.data.refreshAuthToken();
      token = ee.data.getAuthToken();
    }

    if (token) {
      token = token.split(" ")[1];
    }

    if (token) {
      const tokenInfo = await request
        .get(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
        .then((res) => res.data);

      return { access_token: token, ...tokenInfo, client_id: tokenInfo.aud };
    }

    return token;
  }
}

module.exports = TokenService;
