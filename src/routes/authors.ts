import { Router } from "express";

import {
  createAuthor,
  deleteAuthor,
  displayAuthors,
  getAuthorAddForm,
  getAuthorDetails,
  getAuthorEditForm,
  updateAuthor,
} from "../controllers/authors.js";

const authors = Router();

authors.get("/", displayAuthors);

authors.get("/:id(\\d+)", getAuthorDetails);

authors.get("/new", getAuthorAddForm);

authors.post("/", createAuthor);

authors.get("/:id(\\d+)/edit", getAuthorEditForm);

// PUT
authors.post("/:id(\\d+)", updateAuthor);

// DELETE
authors.post("/:id(\\d+)/delete", deleteAuthor);

export default authors;
