import { Router } from "express";

import {
  createAuthor,
  displayAuthors,
  getAuthorAddForm,
} from "../controllers/authors.js";

const authors = Router();

authors.get("/", displayAuthors);

authors.get("/:id");

authors.get("/new", getAuthorAddForm);

authors.post("/", createAuthor);

authors.get("/:id/edit");

authors.put("/:id");

authors.delete("/:id");

export default authors;
