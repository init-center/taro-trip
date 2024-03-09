import db from "@/db";
import { fail, notFound, success } from "@/utils/response";
import { Router } from "express";

const citiesRouter = Router();

citiesRouter.get("/:cityName/airports", async (req, res) => {
  const cityName = req.params.cityName;
  try {
    const result = await db.query.airports.findMany({
      where: (airports, { eq }) => eq(airports.cityName, cityName),
    });
    if (result.length) {
      success(res, result);
    } else {
      notFound(res);
    }
  } catch (e) {
    fail(res, e.message);
  }
});

export default citiesRouter;
