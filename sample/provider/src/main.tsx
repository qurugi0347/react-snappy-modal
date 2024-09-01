import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BookProvider } from "./book/BookContext.tsx";
import { SnappyModalProvider } from "../../../src";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BookProvider>
      <SnappyModalProvider>
        <App />
      </SnappyModalProvider>
    </BookProvider>
  </React.StrictMode>,
);
