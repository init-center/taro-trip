import { type Express } from "express";
import adsRouter from "./ads";
import airportsRouter from "./airports";
import flightsRouter from "./flights";
import citiesRouter from "./cities";
import loginRouter from "./login";
import ordersRouter from "./orders";

export function router(app: Express) {
  app.use("/ads", adsRouter);
  app.use("/airports", airportsRouter);
  app.use("/flights", flightsRouter);
  app.use("/cities", citiesRouter);
  app.use("/login", loginRouter);
  app.use("/orders", ordersRouter);
}
