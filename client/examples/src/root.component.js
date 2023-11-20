import Helper from "./utils/Example";
import { BrowserRouter } from "react-router-dom";
import React from "react";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Helper />
      </BrowserRouter>
    </>
  );
}
