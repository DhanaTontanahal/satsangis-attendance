import React, { useState } from "react";
import styled from "styled-components";

const BookContainer = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BorrowButton = styled.button`
  padding: 10px;
  background-color: ${(props) => (props.borrowed ? "#aaa" : "#28a745")};
  color: white;
  border: none;
  cursor: ${(props) => (props.borrowed ? "not-allowed" : "pointer")};
`;

const LibraryManagement = () => {
  const [books, setBooks] = useState([
    { id: 1, title: "Book One", borrowed: false, borrower: "", returnDate: "" },
    { id: 2, title: "Book Two", borrowed: false, borrower: "", returnDate: "" },
    // Add more books as needed
  ]);

  const borrowBook = (id) => {
    setBooks(
      books.map((book) => {
        if (book.id === id) {
          if (!book.borrowed) {
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 7);
            book.borrowed = true;
            book.borrower = "John Doe"; // Replace with actual borrower info
            book.returnDate = returnDate.toLocaleDateString();
          }
        }
        return book;
      })
    );
  };

  return (
    <div style={{ margin: "50px" }}>
      <h1>Library Management (Work in progress)</h1>
      {books.map((book) => (
        <BookContainer key={book.id}>
          <div>
            <h3>{book.title}</h3>
            {book.borrowed && (
              <p>
                Borrowed by: {book.borrower} <br />
                Return Date: {book.returnDate}
              </p>
            )}
          </div>
          <BorrowButton
            borrowed={book.borrowed}
            onClick={() => borrowBook(book.id)}
            disabled={book.borrowed}
          >
            {book.borrowed ? "Borrowed" : "Borrow"}
          </BorrowButton>
        </BookContainer>
      ))}
    </div>
  );
};

export default LibraryManagement;
