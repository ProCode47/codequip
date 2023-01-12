import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import blob from "./assets/blobb.svg";
import blob2 from "./assets/blobb2.svg";
import blob3 from "./assets/blobb3.svg";

type Props = {};

export default function Home({}: Props) {
  // localStorage.clear()

  return (
    <div className="hero">
      <div className="glass1"></div>
      <img className="blob blob1" src={blob} alt="wave" />
      <div className="glass2"></div>
      <img className="blob blob2" src={blob2} alt="wave" />

      <h1>
        welcome to streakbot<em>.</em>
      </h1>
      <p>Get social with your streaks!</p>
      <p>
        {" "}
        Use the keyword <b>tweet: </b>in your commits
      </p>
      <p className="code">
        git commit -m "tweet: I just added this amazing feature that I had to
        share!"
      </p>

      <a href="https://github.com/login/oauth/authorize?allow_signup=true&client_id=78e4180c3b7b6aeb4ea7&redirect_uri=http://127.0.0.1:5173/authorized/streak&scope=public_repo">
        <button>Connect with Github</button>
      </a>
    </div>
  );
}
