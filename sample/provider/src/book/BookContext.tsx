import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Book } from "./Book.ts";

const BookContext = createContext({
  bookList: [] as Book[],
  setBookList: (_: Book[]) => {},
});

export const BookProvider = ({ children }: PropsWithChildren) => {
  const [bookList, setBookList] = useState<Book[]>([
    { id: 1, title: "Book 1", author: "Author 1", publisher: "Publisher 1" },
    { id: 2, title: "Book 2", author: "Author 2", publisher: "Publisher 2" },
    { id: 3, title: "Book 3", author: "Author 3", publisher: "Publisher 3" },
    { id: 3, title: "Book 4", author: "Author 4", publisher: "Publisher 4" },
  ]);
  return (
    <BookContext.Provider value={{ bookList, setBookList }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  return useContext(BookContext);
};
