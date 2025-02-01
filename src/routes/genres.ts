import { Router } from "express";

import {
  createGenre,
  displayGenres,
  getGenreForm,
} from "../controllers/genres.js";

const genres = Router();

genres.get("/", displayGenres);

genres.get("/:id");

genres.get("/new", getGenreForm);

genres.post("/", createGenre);

genres.get("/:id/edit");

genres.put("/:id");

genres.delete("/:id");

export default genres;
