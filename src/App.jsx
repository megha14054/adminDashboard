import React, { useEffect, useState } from "react";
import UserData from "./components/UserData.jsx";

const APIs = [
  "https://openlibrary.org/people/mekBot/books/want-to-read.json",
  "https://openlibrary.org/people/mekBot/books/currently-reading.json",
  "https://openlibrary.org/people/mekBot/books/already-read.json"
];

const App = () => {
  const [booksByAuthors, setBooksByAuthors] = useState({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const promises = APIs.map(url => fetch(url).then(res => res.json()));
        const responses = await Promise.all(promises);
        const allBooks = responses.flatMap(data => data.reading_log_entries || []);

        // Process the books to group by author names
        const authors = {};
        allBooks.forEach(({ work }) => {
          if (work && work.author_names && work.title) {
            work.author_names.forEach(author => {
              if (!authors[author]) {
                authors[author] = [];
              }
              authors[author].push(work.title);
            });
          }
        });

        setBooksByAuthors(authors);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Author Name</th>
            <th>Book Titles</th>
          </tr>
        </thead>
        <tbody>
          <UserData booksByAuthors={booksByAuthors} />
        </tbody>
      </table>
    </>
  );
};

export default App;
