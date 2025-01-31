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

const getGenreForm: RequestHandler = (req, res) => {
  res.render("genres/add-genre");
};

const createGenre: RequestHandler[] = [
  ...validateGenreName,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const genreName = req.body["genre-name"]?.trim();
    const genreDescription = req.body["genre-description"]?.trim();

    try {
      await db.createGenre(genreName, genreDescription);
      return res.redirect("");
    } catch (e: any) {
      if (e.code === "23505") {
        res.redirect("./new");
        // TODO: Show the error message
      }
      next(e);
    }
  }),
];

export { getGenreForm, createGenre };
