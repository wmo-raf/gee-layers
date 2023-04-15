const Router = require("koa-router");

const GeeService = require("services/gee-service");

const router = new Router({
  prefix: "/gee",
});

class GeeRouter {
  static async getTileUrl(ctx) {
    const postData = ctx.request.body;

    // const { geojson, datasetId } = postData;

    const tileUrl = await GeeService.getTileUrl(postData);

    ctx.body = { tileUrl };
  }
}

router.post("/tile-url", GeeRouter.getTileUrl);

module.exports = router;
