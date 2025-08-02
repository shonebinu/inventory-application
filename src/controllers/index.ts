import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";

import db from "../db/queries.js";

const displayIndex: RequestHandler = asyncHandler(async (req, res) => {
  const count = await db.getCountAll();
  res.render("index", { count });
});

export { displayIndex };
