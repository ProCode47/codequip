import axios from "axios";
import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import GetStarted from "./GetStarted";
import Home from "./Home";
import ListRepo from "./ListRepo";
export default function App() {


  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/authorized/streak" element={<ListRepo />} />
      <Route path="/streaker" element={<GetStarted />} />
      <Route path="/*" element={<h1 style={{textAlign:"center",marginTop:"35vh"}}> Seems like you're lost, buddy. <br/> <a style={{textDecoration:"underline"}} href="/">Click here to go back</a></h1>} />
    </Routes>
  );
}
