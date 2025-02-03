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

const displayGenres: RequestHandler = asyncHandler(async (req, res) => {
  const genres = await db.getGenres();
  res.render("view-table-generic", { type: "genre", items: genres });
});

const getGenreForm: RequestHandler = (req, res) => {
  res.render("add-form-generic", { type: "genre" });
};

const createGenre: RequestHandler[] = [
  ...validateGenreName,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg),
      );
      return res.redirect("/genres/new");
    }

    const genreName = req.body["genre-name"]?.trim();
    const genreDescription = req.body["genre-description"]?.trim();

    try {
      await db.createGenre(genreName, genreDescription);
      res.redirect("/genres");
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "23505") {
        req.flash("errors", ["Genre already exists"]);
        return res.redirect("/genres/new");
      }
      next(e);
    }
  }),
];

const getGenreDetails: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const genreDetails = await db.getGenreDetails(Number(id));
  res.render("get-details-generic", { genreDetails });
});

const deleteGenre: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.deleteGenre(Number(id));
  res.redirect("/genres");
});

export {
  displayGenres,
  getGenreForm,
  createGenre,
  getGenreDetails,
  deleteGenre,
};
