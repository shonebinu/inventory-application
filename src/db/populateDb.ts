import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const SQL = `
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS author (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS genre (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS book_author (
  book_id INTEGER REFERENCES book(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES author(id) ON DELETE CASCADE,
  PRIMARY KEY(book_id, author_id)
);

CREATE TABLE IF NOT EXISTS book_genre (
  book_id INTEGER REFERENCES book(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genre(id) ON DELETE CASCADE,
  PRIMARY KEY(book_id, genre_id)
);
`;

const connectionString = process.env.DB_URL || process.argv[2];

if (!connectionString) {
  console.error(
    "Error: Please provide a connection URL as an argument or configure .env file.",
  );
  console.log(
    "Connection URL example: postgresql://<role_name>:<role_password>@<db_host>:5432/<db_name>",
  );
  process.exit(1);
}

console.log("Seeding...");

const { hostname } = new URL(connectionString);

const sslConfig = ["localhost", "127.0.0.1"].includes(hostname)
  ? false
  : { rejectUnauthorized: false };

const client = new Client({
  connectionString,
  ssl: sslConfig,
});

try {
  await client.connect();
  await client.query(SQL);
  console.log("Database seeded successfully.");
} catch (error) {
  console.log("Error seeding the database:", error);
} finally {
  await client.end();
}
