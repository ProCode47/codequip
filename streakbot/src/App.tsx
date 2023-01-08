import axios from "axios";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home";
import ListRepo from "./ListRepo";
export default function App() {


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/authorized/streak" element={<ListRepo />} />
      <Route path="/*" element={<h1 style={{textAlign:"center"}}> You're basically lost my gee.</h1>} />
    </Routes>
  );
}
