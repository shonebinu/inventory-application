import { Router } from "express";

const books = Router();

books.get("/");

books.get("/:id");

books.get("/new");

books.post("/");

books.get("/:id/edit");

books.put("/:id");

books.delete("/:id");

export default books;
