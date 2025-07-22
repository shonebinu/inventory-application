import type { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

import db from "../db/queries.js";
import { getImageUrl } from "../utils/getImageUrl.js";

const validateGenreName: RequestHandler = body("genre-name")
  .trim()
  .notEmpty()
  .withMessage("Genre name shouldn't be empty");

const displayGenres: RequestHandler = asyncHandler(async (req, res) => {
  const genres = await db.getGenres();
  res.render("genres/tabular-view", { items: genres });
});

const getGenreAddForm: RequestHandler = (req, res) => {
  res.render("genres/add-genre-view");
};

const getGenreEditForm: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const genre = await db.getGenre(Number(id));
  res.render("genres/edit-genre-view", { genre });
});

const createGenre: RequestHandler[] = [
  validateGenreName,
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

  await Promise.all(
    genreDetails.books.map(
      async (book: { title: string; imageUrl: string }) => {
        book.imageUrl = (await getImageUrl(book.title)) || "/no-cover-book.jpg";
      },
    ),
  );

  res.render("genres/detailed-view", { genreDetails });
});

const deleteGenre: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.deleteGenre(Number(id));
  res.redirect("/genres");
});

const updateGenre: RequestHandler[] = [
  validateGenreName,
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "errors",
        errors.array().map((err) => err.msg),
      );
      return res.redirect("/genres/" + id + "/edit");
    }

    const genreName = req.body["genre-name"]?.trim();
    const genreDescription = req.body["genre-description"]?.trim();

    try {
      await db.updateGenre(Number(id), genreName, genreDescription);
      res.redirect("/genres/" + id);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === "23505") {
        req.flash("errors", ["Genre with this name already exists"]);
        return res.redirect("/genres/" + id + "/edit");
      }
      next(e);
    }
  }),
];

export {
  displayGenres,
  getGenreAddForm,
  getGenreEditForm,
  createGenre,
  getGenreDetails,
  updateGenre,
  deleteGenre,
};
