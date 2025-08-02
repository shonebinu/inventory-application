import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import db from "../db/queries.js";
import { getImageUrl } from "../utils/getImageUrl.js";

const validateBookName: RequestHandler = body("book-title")
  .trim()
  .notEmpty()
  .withMessage("Book title shouldn't be empty");

const displayBooks: RequestHandler = asyncHandler(async (req, res) => {
  const books = await db.getBooks();
  res.render("books/tabular-view", { items: books });
});

const getBookAddForm: RequestHandler = asyncHandler(async (req, res) => {
  const authorsAndGenres = await db.getGenresAndAuthorsName();
  res.render("books/add-book-view", authorsAndGenres);
});

const getBookEditForm: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const book = await db.getBook(Number(id));
  const authorsAndGenres = await db.getGenresAndAuthorsName();
  res.render("books/edit-book-view", { book, ...authorsAndGenres });
});

const getBookDetails: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bookDetails = await db.getBookDetails(Number(id));
  bookDetails.imageUrl =
    (await getImageUrl(bookDetails.title)) || "/no-cover-book.jpg";
  res.render("books/detailed-view", { bookDetails });
});

const createBook: RequestHandler[] = [
  validateBookName,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg),
      );
      return res.redirect("/books/new");
    }

    const bookTitle = req.body["book-title"]?.trim();
    const bookAuthor = req.body["book-author"];
    const bookGenre = req.body["book-genre"];
    const bookDescription = req.body["book-description"]?.trim();

    try {
      await db.createBook(bookTitle, bookAuthor, bookGenre, bookDescription);
      res.redirect("/books");
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "23505") {
        req.flash("errors", ["Book already exists"]);
        return res.redirect("/books/new");
      }
      next(e);
    }
  }),
];

const updateBook: RequestHandler[] = [
  validateBookName,
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg),
      );
      return res.redirect("/books/" + id + "/edit");
    }

    const bookTitle = req.body["book-title"]?.trim();
    const bookAuthor = req.body["book-author"];
    const bookGenre = req.body["book-genre"];
    const bookDescription = req.body["book-description"]?.trim();

    try {
      await db.updateBook(
        Number(id),
        bookTitle,
        bookAuthor,
        bookGenre,
        bookDescription,
      );
      res.redirect("/books/" + id);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "23505") {
        req.flash("errors", ["Book with this title already exists"]);
        return res.redirect("/books/" + id + "/edit");
      }
      next(e);
    }
  }),
];

const deleteBook: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.deleteBook(Number(id));
  res.redirect("/books");
});

export {
  displayBooks,
  getBookAddForm,
  updateBook,
  createBook,
  getBookDetails,
  deleteBook,
  getBookEditForm,
};
