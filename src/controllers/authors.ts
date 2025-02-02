import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import db from "../db/queries.js";

const validateAuthorName: RequestHandler[] = [
  body("author-name")
    .trim()
    .notEmpty()
    .withMessage("Author name shouldn't be empty"),
];

const displayAuthors: RequestHandler = asyncHandler(async (req, res) => {
  const authors = await db.getAuthors();
  res.render("view-table-generic", { type: "author", items: authors });
});

const getAuthorForm: RequestHandler = (req, res) => {
  res.render("add-form-generic", { type: "author" });
};

const createAuthor: RequestHandler[] = [
  ...validateAuthorName,
  asyncHandler(async (req, res) => {
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

    await db.createAuthor(authorName, authorBio);

    res.redirect("/authors");
  }),
];

export { createAuthor, displayAuthors, getAuthorForm };
