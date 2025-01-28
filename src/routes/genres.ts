import { Router } from "express";

const genres = Router();

genres.get("/");

genres.get("/:id");

genres.get("/new");

genres.post("/");

genres.get("/:id/edit");

genres.put("/:id");

genres.delete("/:id");

export default genres;
