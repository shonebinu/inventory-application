import { Router } from "express";

import {
  createGenre,
  deleteGenre,
  displayGenres,
  getGenreAddForm,
  getGenreDetails,
  getGenreEditForm,
  updateGenre,
} from "../controllers/genres.js";

const genres = Router();

genres.get("/", displayGenres);

genres.get("/:id(\\d+)", getGenreDetails);

genres.get("/new", getGenreAddForm);

genres.get("/:id/edit", getGenreEditForm);

genres.post("/", createGenre);

// DELETE
genres.post("/:id(\\d+)/delete", deleteGenre);

// PUT
genres.post("/:id", updateGenre);

export default genres;
