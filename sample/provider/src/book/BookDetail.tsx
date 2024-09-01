import { useBookContext } from "./BookContext.tsx";
import { useMemo } from "react";
import styled from "styled-components";

type BookDetailProps = {
  id: number;
};

export function BookDetail(props: BookDetailProps) {
  const { id } = props;
  const { bookList } = useBookContext();
  const book = useMemo(() => {
    console.log({ bookList, id });
    return bookList.find(book => book.id === id);
  }, [id, bookList]);
  if (!book) {
    return <Wrapper>Book not found</Wrapper>;
  }
  return (
    <Wrapper>
      <h2>Book Detail</h2>
      <div>{book.id}</div>
      <div>{book.title}</div>
      <div>{book.author}</div>
      <div>{book.publisher}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: white;
`;
