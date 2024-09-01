import { useBookContext } from "./BookContext.tsx";
import { Book } from "./Book.ts";
import styled from "styled-components";
import SnappyModal from "../../../../src";
import { BookDetail } from "./BookDetail.tsx";

export function BookList() {
  const { bookList } = useBookContext();
  const onClickBook = (id: number) => () => {
    SnappyModal.show(<BookDetail id={id} />);
  };
  return (
    <div>
      <h2>Book List</h2>
      <ListWrapper>
        {bookList.map(book => (
          <BookListItem
            key={book.id}
            {...book}
            onClick={onClickBook(book.id)}
          />
        ))}
      </ListWrapper>
    </div>
  );
}

const ListWrapper = styled.div`
  padding: 4px;
`;

type BookListItemProps = Book & {
  onClick: () => void;
};

function BookListItem(props: BookListItemProps) {
  return (
    <ItemWrapper onClick={props.onClick}>
      <div>{props.id}</div>
      <div>{props.title}</div>
    </ItemWrapper>
  );
}

const ItemWrapper = styled.div`
  display: flex;
  padding: 8px 12px;
  gap: 8px;
  cursor: pointer;
  &:nth-child(even) {
    background-color: #bbb;
  }
  &:nth-child(odd) {
    background-color: white;
  }
  &:hover {
    background-color: #666;
  }
`;
