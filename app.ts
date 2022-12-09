/**
 * Module dependencies.
 */
import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import cors from "cors";
import morgan from "morgan";
import routes from "./src/routes";

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

const createApp = () => {
  const app = express();
  const swaggerYaml = YAML.load("./swaggerYaml.yaml");

  app.use(express.json());
  app.use(cors());
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );

  app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "pong" });
    next();
  });

  app.use("/api-yaml", swaggerUi.serve, swaggerUi.setup(swaggerYaml));

  app.use(routes);

  return app;
};

/**
 * Module exports.
 * @public
 */

export { createApp };
