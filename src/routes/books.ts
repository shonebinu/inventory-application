import { Router } from "express";

import {
  createBook,
  deleteBook,
  displayBooks,
  getBookAddForm,
  getBookDetails,
  getBookEditForm,
  updateBook,
} from "../controllers/books.js";

const books = Router();

books.get("/", displayBooks);

books.get("/new", getBookAddForm);

books.get("/:id(\\d+)", getBookDetails);

books.post("/", createBook);

books.get("/:id(\\d+)/edit", getBookEditForm);

// PUT
books.post("/:id(\\d+)", updateBook);

// DELETE
books.post("/:id(\\d+)/delete", deleteBook);

export default books;
