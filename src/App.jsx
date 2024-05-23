import React, { useEffect, useState } from "react";
import UserData from "./components/UserData.jsx";
import { saveAs } from 'file-saver';

const APIs = [
  "https://openlibrary.org/people/mekBot/books/want-to-read.json",
  "https://openlibrary.org/people/mekBot/books/currently-reading.json",
  "https://openlibrary.org/people/mekBot/books/already-read.json"
];

const App = () => {
  const [booksByAuthors, setBooksByAuthors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const promises = APIs.map(url => fetch(url).then(res => res.json()));
        const responses = await Promise.all(promises);
        const allBooks = responses.flatMap(data => data.reading_log_entries || []);

        
        const authors = {};
        const authorDetailsPromises = [];

        allBooks.forEach(({ work }) => {
          if (work && work.author_names && work.title) {
            work.author_names.forEach((author, index) => {
              if (!authors[author]) {
                authors[author] = {
                  books: [],
                  author_key: work.author_keys[index],
                };
                // Fetch author details
                authorDetailsPromises.push(
                  fetch(`https://openlibrary.org${work.author_keys[index]}.json`).then(res => res.json())
                );
              }
              authors[author].books.push({ title: work.title, first_publish_year: work.first_publish_year });
            });
          }
        });

        const authorDetails = await Promise.all(authorDetailsPromises);

        authorDetails.forEach(authorDetail => {
          const authorName = authorDetail.name;
          const authorKey = authorDetail.key;
          const foundAuthor = Object.keys(authors).find(key => authors[key].author_key === authorKey);
          if (foundAuthor) {
            authors[foundAuthor].birth_date = authorDetail.birth_date;
            authors[foundAuthor].top_work = authorDetail.top_work;
          }
        });

        setBooksByAuthors(authors);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false); 
      }
    };

    fetchBooks();
  }, []);

  const downloadCSV = () => {
    const csvData = convertToCSV(booksByAuthors);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'books.csv');
  };

  const convertToCSV = (data) => {
    let csv = 'Author Name,Book Titles,First Publish Year,Birth Date,Top Work\n';
    Object.keys(data).forEach(author => {
      const bookTitles = data[author].books.map(book => book.title).join('|');
      const firstPublishYears = data[author].books.map(book => book.first_publish_year).join('|');
      const birthDate = data[author].birth_date || 'N/A';
      const topWork = data[author].top_work || 'N/A';
      csv += `${author},"${bookTitles}","${firstPublishYears}","${birthDate}","${topWork}"\n`;
    });
    return csv;
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <button className="button" onClick={downloadCSV}>Download CSV</button>
          <table>
            <thead>
              <tr>
                <th>Author Name</th>
                <th>Book Titles</th>
                <th>First Publish Year</th>
                <th>Birth Date</th>
                <th>Top Work</th>
              </tr>
            </thead>
            <tbody>
              <UserData booksByAuthors={booksByAuthors} />
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default App;


