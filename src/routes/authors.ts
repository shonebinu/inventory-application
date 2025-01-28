import { Router } from "express";

const authors = Router();

authors.get("/");

authors.get("/:id");

authors.get("/new");

authors.post("/");

authors.get("/:id/edit");

authors.put("/:id");

authors.delete("/:id");

export default authors;
