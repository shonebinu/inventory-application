import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import db from "../db/queries.js";
import { getImageUrl } from "../utils/getImageUrl.js";

const validateAuthorName: RequestHandler = body("author-name")
  .trim()
  .notEmpty()
  .withMessage("Author name shouldn't be empty");

const displayAuthors: RequestHandler = asyncHandler(async (req, res) => {
  const authors = await db.getAuthors();
  res.render("authors/tabular-view", { items: authors });
});

const getAuthorAddForm: RequestHandler = (req, res) => {
  res.render("authors/add-author-view");
};

const createAuthor: RequestHandler[] = [
  validateAuthorName,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg),
      );
      return res.redirect("/authors/new");
    }

    const authorName = req.body["author-name"]?.trim();
    const authorBio = req.body["author-bio"]?.trim();

    try {
      await db.createAuthor(authorName, authorBio);
      res.redirect("/authors");
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "23505") {
        req.flash("errors", ["Author already exists"]);
        return res.redirect("/authors/new");
      }
      next(e);
    }
  }),
];

const getAuthorDetails: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const authorDetails = await db.getAuthorDetails(Number(id));

  await Promise.all(
    authorDetails.books.map(
      async (book: { title: string; imageUrl: string }) => {
        book.imageUrl = (await getImageUrl(book.title)) || "/no-cover-book.jpg";
      },
    ),
  );

  res.render("authors/detailed-view", { authorDetails });
});

const getAuthorEditForm: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const author = await db.getAuthor(Number(id));

  res.render("authors/edit-author-view", { author });
});

const updateAuthor: RequestHandler[] = [
  validateAuthorName,
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg),
      );
      return res.redirect("/authors/" + id + "/edit");
    }

    const authorName = req.body["author-name"]?.trim();
    const authorBio = req.body["author-bio"]?.trim();

    try {
      await db.updateAuthor(Number(id), authorName, authorBio);
      res.redirect("/authors/" + id);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "23505") {
        req.flash("errors", ["Author with this name already exists"]);
        return res.redirect("/authors/" + id + "/edit");
      }
      next(e);
    }
  }),
];

const deleteAuthor: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.deleteAuthor(Number(id));
  res.redirect("/authors");
});

export {
  createAuthor,
  displayAuthors,
  getAuthorAddForm,
  getAuthorDetails,
  deleteAuthor,
  getAuthorEditForm,
  updateAuthor,
};
