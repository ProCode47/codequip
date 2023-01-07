import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import wave from "./assets/wave.svg";

export default function App() {
  const search = useLocation().search;
  useEffect(() => {
    const code = new URLSearchParams(search).get("code");
    if (code) {
      axios.post(`http://localhost:5000/auth/?code=${code}`).then((response)  => {
        console.log(response);
      });
    }
  }, []);

  return (
    <div className="hero">
      <h1> Welcome to Streakbot</h1>
      <p> Easily share your streaks!</p>

      <a href="https://github.com/login/oauth/authorize?allow_signup=true&client_id=78e4180c3b7b6aeb4ea7&redirect_uri=http://127.0.0.1:5173/authorized/streak">
        <button>Connect with Github</button>
      </a>

      <img src={wave} alt="wave" />
    </div>
  );
}
