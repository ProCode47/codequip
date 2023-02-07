import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style//style.scss";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
      <ToastContainer  style={{ paddingTop:"1rem", marginLeft:"auto",width: "fit-content" }} />
      <App />
    </BrowserRouter>
);
