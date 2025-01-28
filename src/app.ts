import path from "node:path";

import express, { type ErrorRequestHandler } from "express";

import authorsRouter from "./routes/authors.js";
import booksRouter from "./routes/books.js";
import genresRouter from "./routes/genres.js";
import indexRouter from "./routes/index.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "../views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(import.meta.dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.use("/books", booksRouter);
app.use("/authors", authorsRouter);
app.use("/genres", genresRouter);
app.use("/", indexRouter);

app.use((req, res) => {
  res.status(404).render("404", { url: req.originalUrl });
});

const errorRequestHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).render("error", {
    message: err.message,
  });
};

app.use(errorRequestHandler);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Mini Message Board - listening on port ${PORT}`);
});
