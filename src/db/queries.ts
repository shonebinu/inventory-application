import pool from "./pool.js";

async function createGenre(genreName: string, genreDescription: string) {
  await pool.query("INSERT INTO genre (name, description) VALUES ($1, $2)", [
    genreName,
    genreDescription,
  ]);
}

async function createBook(
  bookTitle: string,
  bookAuthor: string,
  bookGenre: string,
  bookDescription: string,
) {
  const result = await pool.query(
    `INSERT INTO book (title, description)
   VALUES ($1, $2)
   RETURNING id`,
    [bookTitle, bookDescription],
  );

  const bookId = result.rows[0].id;

  await pool.query(
    `INSERT INTO book_author (book_id, author_id) VALUES ($1, $2)`,
    [bookId, bookAuthor],
  );

  await pool.query(
    `INSERT INTO book_genre (book_id, genre_id) VALUES ($1, $2)`,
    [bookId, bookGenre],
  );
}

async function updateBook(
  bookId: number,
  bookTitle: string,
  bookAuthor: string,
  bookGenre: string,
  bookDescription: string,
) {
  await pool.query(
    `UPDATE book SET title = $1, description = $2 WHERE id = $3`,
    [bookTitle, bookDescription, bookId],
  );

  await pool.query(`DELETE FROM book_author WHERE book_id = $1`, [bookId]);
  await pool.query(
    `INSERT INTO book_author (book_id, author_id) VALUES ($1, $2)`,
    [bookId, bookAuthor],
  );

  await pool.query(`DELETE FROM book_genre WHERE book_id = $1`, [bookId]);
  await pool.query(
    `INSERT INTO book_genre (book_id, genre_id) VALUES ($1, $2)`,
    [bookId, bookGenre],
  );
}

async function updateGenre(
  genreId: number,
  newGenreName: string,
  newGenreDescription: string,
) {
  await pool.query(
    "UPDATE genre SET name = $1, description = $2 WHERE id = $3",
    [newGenreName, newGenreDescription, genreId],
  );
}

async function updateAuthor(
  authorId: number,
  newAuthorName: string,
  newAuthorBio: string,
) {
  await pool.query("UPDATE author SET name = $1, bio = $2 WHERE id = $3", [
    newAuthorName,
    newAuthorBio,
    authorId,
  ]);
}

async function getGenre(genreId: number) {
  const { rows } = await pool.query(
    `SELECT id, name, description FROM genre WHERE id = $1`,
    [genreId],
  );
  return rows[0];
}

async function getAuthor(authorId: number) {
  const { rows } = await pool.query(
    `SELECT id, name, bio FROM author WHERE id = $1`,
    [authorId],
  );
  return rows[0];
}

async function getBook(bookId: number) {
  const { rows } = await pool.query(
    `SELECT 
      b.id,
      b.title,
      b.description,
      a.id AS author_id,
      g.id AS genre_id
    FROM book b
    LEFT JOIN book_author ba ON ba.book_id = b.id
    LEFT JOIN author a ON a.id = ba.author_id
    LEFT JOIN book_genre bg ON bg.book_id = b.id
    LEFT JOIN genre g ON g.id = bg.genre_id
    WHERE b.id = $1;`,
    [bookId],
  );
  return rows[0];
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

async function getGenresAndAuthorsName() {
  const { rows: authors } = await pool.query(`SELECT id, name FROM author`);
  const { rows: genres } = await pool.query(`SELECT id, name FROM genre`);
  return { authors, genres };
}

async function getBooks() {
  const { rows } = await pool.query(
    `SELECT 
      b.*, 
      a.name AS author_name, 
      g.name AS genre_name
    FROM 
      book b
    LEFT JOIN 
      book_author ba ON b.id = ba.book_id
    LEFT JOIN 
      author a ON ba.author_id = a.id
    LEFT JOIN 
      book_genre bg ON b.id = bg.book_id
    LEFT JOIN 
      genre g ON bg.genre_id = g.id;
    `,
  );
  return rows;
}

async function getGenreDetails(genreId: number) {
  const { rows: genreRows } = await pool.query(
    `SELECT id, name, description FROM genre WHERE id = $1`,
    [genreId],
  );

  const { rows: bookRows } = await pool.query(
    `SELECT id, title, description FROM book WHERE id IN (SELECT book_id FROM book_genre WHERE genre_id = $1)`,
    [genreId],
  );

  return {
    ...genreRows[0],
    books: bookRows,
  };
}

async function getAuthorDetails(authorId: number) {
  const { rows: authorRows } = await pool.query(
    `SELECT id, name, bio FROM author WHERE id = $1`,
    [authorId],
  );

  const { rows: bookRows } = await pool.query(
    `SELECT id, title, description FROM book WHERE id IN (SELECT book_id FROM book_author WHERE author_id = $1)`,
    [authorId],
  );

  return { ...authorRows[0], books: bookRows };
}

async function getBookDetails(bookId: number) {
  const { rows: bookRows } = await pool.query(
    `SELECT id, title, description FROM book WHERE id = $1`,
    [bookId],
  );

  return { ...bookRows[0] };
}

async function deleteGenre(genreId: number) {
  await pool.query(`DELETE FROM genre WHERE id = $1`, [genreId]);
}

async function deleteAuthor(authorId: number) {
  await pool.query(`DELETE FROM author WHERE id = $1`, [authorId]);
}

async function deleteBook(bookId: number) {
  await pool.query(`DELETE FROM book WHERE id = $1`, [bookId]);
}

async function getCountAll() {
  const { rows } = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM book) AS book_count,
      (SELECT COUNT(*) FROM author) AS author_count,
      (SELECT COUNT(*) FROM genre) AS genre_count
  `);
  return rows[0];
}

export default {
  getCountAll,
  getGenre,
  createBook,
  getGenres,
  deleteBook,
  getAuthorDetails,
  createGenre,
  deleteAuthor,
  getAuthors,
  createAuthor,
  getGenreDetails,
  updateBook,
  updateGenre,
  updateAuthor,
  getBook,
  deleteGenre,
  getBooks,
  getGenresAndAuthorsName,
  getBookDetails,
  getAuthor,
};
