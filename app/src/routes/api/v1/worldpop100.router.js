const Router = require("koa-router");
const logger = require("logger");

const GeostoreService = require("services/geostore-service");
const WorlPopService = require("services/analysis/worlpop100-service");

const router = new Router({
  prefix: "/worldpop100",
});

class WorldPopRouter {
  static async getByGeostore(ctx) {
    ctx.assert(ctx.query.geostore, 400, "geostore required");

    const geostoreId = ctx.query.geostore;

    let buffer = ctx.query.buffer;

    if (buffer) {
      if (!isNaN(Number(buffer))) {
        buffer = Number(buffer);

        if (buffer < 1 || buffer > 50) {
          ctx.throw(400, "Allowed buffer values are between 1 and 50");
        }
      } else {
        ctx.throw(400, `Invalid buffer value: '${buffer}'`);
      }
    }

    const geojson = await GeostoreService.get(geostoreId);

    if (!geojson) {
      ctx.throw(404, "GeoStore not found");
      return;
    }

    const results = WorlPopService.analyze(geojson, buffer);

    ctx.body = results;
  }
}

router.get("/", WorldPopRouter.getByGeostore);

module.exports = router;
