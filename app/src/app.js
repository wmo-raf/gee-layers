const config = require("config");
const logger = require("logger");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const koaLogger = require("koa-logger");
const loader = require("loader");
const ErrorSerializer = require("serializers/errorSerializer");
const koaSimpleHealthCheck = require("koa-simple-healthcheck");
const cors = require("@koa/cors");

const PORT = config.get("port");

async function init() {
  return new Promise((resolve, reject) => {
    // instance of koa
    const app = new Koa();

    app.use(cors());

    // if environment is dev then load koa-logger

    app.use(koaLogger());

    app.use(koaSimpleHealthCheck());

    app.use(
      bodyParser({
        jsonLimit: "5mb",
      })
    );

    // catch errors and send in jsonapi standard. Always return vnd.api+json
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (inErr) {
        let error = inErr;
        try {
          error = JSON.parse(inErr);
        } catch (e) {
          logger.debug("Could not parse error message - is it JSON?: ", inErr);
          error = inErr;
        }
        ctx.status = error.status || ctx.status || 500;
        if (ctx.status >= 500) {
          logger.error(error);
        } else {
          logger.info(error);
        }

        ctx.body = ErrorSerializer.serializeError(ctx.status, error.message);
        if (process.env.NODE_ENV === "prod" && ctx.status === 500) {
          ctx.body = "Unexpected error";
        }
        ctx.response.type = "application/json";
      }
    });

    // load routes
    loader.loadRoutes(app);

    const server = app.listen(PORT, () => {
      logger.info("Server started in ", PORT);
      resolve({ app, server });
    });
  });
}

module.exports = init;
