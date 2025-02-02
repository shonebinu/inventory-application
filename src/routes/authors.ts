import { Router } from "express";

import {
  createAuthor,
  displayAuthors,
  getAuthorForm,
} from "../controllers/authors.js";

const authors = Router();

authors.get("/", displayAuthors);

authors.get("/:id");

authors.get("/new", getAuthorForm);

authors.post("/", createAuthor);

authors.get("/:id/edit");

authors.put("/:id");

authors.delete("/:id");

export default authors;
