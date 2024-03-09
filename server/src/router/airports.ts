import db from "@/db";
import { fail, success } from "@/utils/response";
import { Router } from "express";

const airportsRouter = Router();

airportsRouter.get("/", async (_req, res) => {
  try {
    const result = await db.query.airports.findMany();
    success(res, result);
  } catch (e) {
    fail(res, e.message);
  }
});

export default airportsRouter;
