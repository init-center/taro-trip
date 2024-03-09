import db from "@/db";
import { fail, success } from "@/utils/response";
import { Router } from "express";

const adsRouter = Router();

adsRouter.get("/", async (_req, res) => {
  try {
    const result = await db.query.ads.findMany();
    success(res, result);
  } catch (e) {
    fail(res, e.message);
  }
});

export default adsRouter;
