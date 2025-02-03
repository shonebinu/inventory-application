import { Router } from "express";

import {
  createGenre,
  deleteGenre,
  displayGenres,
  getGenreDetails,
  getGenreForm,
} from "../controllers/genres.js";

const genres = Router();

genres.get("/", displayGenres);

genres.get("/:id(\\d+)", getGenreDetails);

genres.get("/new", getGenreForm);

genres.post("/", createGenre);

genres.get("/:id/edit");

genres.put("/:id");

genres.post("/:id(\\d+)/delete", deleteGenre);

export default genres;
