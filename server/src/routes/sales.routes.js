import { Router } from "express";
import { createSale, getLeaderboard } from "../controllers/sales.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const salesRouter = Router();

salesRouter.route("/product").post(verifyJWT, createSale);
salesRouter.route("/get-sales-board").get(getLeaderboard);

export { salesRouter };