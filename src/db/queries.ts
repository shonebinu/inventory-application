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
    GROUP BY genre.id
    ORDER BY genre.name;
`,
  );
  return rows;
}

async function createAuthor(authorName: string, authorBio: string) {
  await pool.query("INSERT INTO author (name, bio) VALUES ($1, $2)", [
    authorName,
    authorBio,
  ]);
}

async function getAuthors() {
  const { rows } = await pool.query(
    `SELECT
      author.id,
      author.name,
      author.bio,
      COUNT(book_author.book_id) AS book_count
    FROM author
    LEFT JOIN book_author
      ON author.id = book_author.author_id
    GROUP BY author.id
    ORDER BY author.name;`,
  );
  return rows;
}

async function getGenreDetails(genreId: number) {
  const { rows: genreRows } = await pool.query(
    `SELECT id, name, description FROM genre WHERE id = $1`,
    [genreId],
  );

  const { rows: bookRows } = await pool.query(
    `SELECT id, title, isbn, publication_date, description FROM book WHERE id IN (SELECT book_id FROM book_genre WHERE genre_id = $1)`,
    [genreId],
  );

  return {
    ...genreRows[0],
    books: bookRows,
  };
}

async function deleteGenre(genreId: number) {
  await pool.query(`DELETE FROM genre WHERE id = $1`, [genreId]);
}

export default {
  getGenres,
  createGenre,
  getAuthors,
  createAuthor,
  getGenreDetails,
  deleteGenre,
};
