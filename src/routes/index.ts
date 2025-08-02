import { Router } from "express";

import { displayIndex } from "../controllers/index.js";

const index = Router();

index.get("/", displayIndex);

export default index;
