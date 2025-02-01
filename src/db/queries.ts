import pool from "./pool.js";

async function createGenre(genreName: string, genreDescription: string) {
  await pool.query("INSERT INTO genre (name, description) VALUES ($1, $2)", [
    genreName,
    genreDescription,
  ]);
}

async function getGenres() {
  const { rows } = await pool.query("SELECT name, description FROM genre");
  return rows;
}

export default { getGenres, createGenre };
