import pool from "./pool.js";

async function createGenre(genreName: string, genreDescription: string) {
  await pool.query("INSERT INTO genre (name, description) VALUES ($1, $2)", [
    genreName,
    genreDescription,
  ]);
}

async function getGenres() {
  const { rows } = await pool.query(
    `SELECT 
      genre.id,
      genre.name, 
      genre.description, 
      COUNT(book_genre.book_id) AS book_count
    FROM genre
    LEFT JOIN book_genre 
      ON genre.id = book_genre.genre_id
    GROUP BY genre.id;
`,
  );
  return rows;
}

export default { getGenres, createGenre };
