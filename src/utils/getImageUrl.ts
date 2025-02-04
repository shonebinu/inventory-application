interface GoogleBooksResponse {
  items?: {
    volumeInfo?: {
      imageLinks?: {
        thumbnail?: string;
      };
    };
  }[];
}

async function getImageUrl(title: string): Promise<string | null> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}`,
  );
  const json = (await response.json()) as GoogleBooksResponse;

  return json.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || null;
}

export { getImageUrl };
