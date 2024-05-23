const UserData = ({ booksByAuthors }) => {
    const authors = Object.keys(booksByAuthors);
    if (authors.length === 0) {
      return (
        <tr>
          <td colSpan="2">No data available</td>
        </tr>
      );
    }
  
    return (
      <>
        {authors.map((author, index) => (
          <tr key={index}>
            <td>{author}</td>
            <td>{booksByAuthors[author].join(", ")}</td>
          </tr>
        ))}
      </>
    );
  };
  
  export default UserData;
  