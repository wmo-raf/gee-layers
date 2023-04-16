const Router = require("koa-router");

const GeeService = require("services/gee-service");

const router = new Router({
  prefix: "/gee",
});

class GeeRouter {
  static async getTileUrl(ctx) {
    const postData = ctx.request.body;

    try {
      const tileUrl = await GeeService.getTileUrl(postData);

      ctx.body = { tileUrl };
    } catch (error) {
      ctx.throw(400, error);
    }
  }
  static async getPeriods(ctx) {
    ctx.assert(ctx.query.datasetId, 400, "datasetId required");

    const { datasetId, startDate, endDate, asFeatureCollection } = ctx.query;

    try {
      const periods = await GeeService.getPeriods(
        datasetId,
        startDate,
        endDate,
        asFeatureCollection
      );
      ctx.body = { periods };
    } catch (error) {
      ctx.throw(400, error);
    }
  }

  static async getAggregations(ctx) {
    const postData = ctx.request.body;

    try {
      const data = await GeeService.getAggregations(postData);
      ctx.body = data;
    } catch (error) {
      ctx.throw(400, error);
    }
  }
}

router.post("/tile-url", GeeRouter.getTileUrl);
router.get("/periods", GeeRouter.getPeriods);
router.post("/aggregations", GeeRouter.getAggregations);

module.exports = router;
