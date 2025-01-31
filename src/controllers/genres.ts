import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import db from "../db/queries.js";

const validateGenreName: RequestHandler[] = [
  body("genre-name")
    .trim()
    .notEmpty()
    .withMessage("Genre name shouldn't be empty"),
];

const getGenreForm: RequestHandler = asyncHandler(async (req, res) => {
  res.render("genres/add-genre");
});

const createGenre: RequestHandler[] = [
  ...validateGenreName,
  asyncHandler((req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).render("errorPage", { errors: errors.array() });
    // TODO: New error page? Error page even needed? Just JSON send?

    const { "genre-name": genreName, "genre-description": genreDescription } =
      req.body;

    // TODO: Check if Genre name already exists
    db.createGenre(genreName, genreDescription);
    res.redirect("");
  }),
];

export { getGenreForm, createGenre };
