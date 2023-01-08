import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import wave from "./assets/wave.svg";

type Props = {};

export default function Home({ }: Props) {
  // localStorage.clear()

  return (
    <div className="hero">
      <h1> Welcome to Streakbot</h1>
      <p> Easily share your streaks!</p>

      <a
        href="https://github.com/login/oauth/authorize?allow_signup=true&client_id=78e4180c3b7b6aeb4ea7&redirect_uri=http://127.0.0.1:5173/authorized/streak&scope=public_repo">
        <button>Connect with Github</button>
      </a>

      <img src={wave} alt="wave" />
    </div>
  );
}
