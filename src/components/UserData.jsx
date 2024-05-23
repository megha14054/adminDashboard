import React, { useState } from "react";

const UserData = ({ booksByAuthors }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const authors = Object.keys(booksByAuthors);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAuthors = authors.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(parseInt(e.target.value));
    setCurrentPage(1); 
  };

  if (authors.length === 0) {
    return (
      <tr>
        <td colSpan="5">No data available</td>
      </tr>
    );
  }

  return (
    <>
      <tr>
        <th colSpan="5">
          Records per page:{" "}
          <select value={recordsPerPage} onChange={handleRecordsPerPageChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </th>
      </tr>
      {currentAuthors.map((author, index) => (
        <tr key={index}>
          <td>{author}</td>
          <td>{booksByAuthors[author].books.map(book => book.title).join(", ")}</td>
          <td>{booksByAuthors[author].books.map(book => book.first_publish_year).join(", ")}</td>
          <td>{booksByAuthors[author].birth_date || 'N/A'}</td>
          <td>{booksByAuthors[author].top_work || 'N/A'}</td>
        </tr>
      ))}
    </>
  );
};

export default UserData;


  
