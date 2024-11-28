import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SnappyModalProvider } from "../../../src/context/SnappyModalContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnappyModalProvider>
      <App />
    </SnappyModalProvider>
  </React.StrictMode>,
);
