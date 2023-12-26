import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import blob from "./assets/blobb.svg";
import blob2 from "./assets/blobb2.svg";
import blob3 from "./assets/blobb3.svg";
import { FiTwitter, FiGithub } from "react-icons/fi";

type Props = {};

export default function GetStarted({}: Props) {
  // localStorage.clear()

  return (
    <div className="hero padding-sm">
      <div className="glass1"></div>
      <img className="blob blob1" src={blob} alt="wave" />
      <div className="glass2"></div>
      <img className="blob blob2" src={blob2} alt="wave" />
      <h1>CodeQuip has been setup! 🎉</h1>
      <h3 style={{fontWeight:"lighter"}}>Use the keyword <b>tweet: </b>in your commit messages and you're good to go! 🔥 🚀</h3>
      <h3 >
        Here are some fun examples to get you on your way 😏
      </h3>
      <p className="code">
        git commit -m "tweet: I just added this amazing feature that I had to
        share!" <br /><br /> git commit -m "tweet: If you haven't tried out Streakbot,
        you're missing out fr!" <br /><br /> git commit -m "tweet: it's the best thing
        since sliced bread... or pringles"
      </p>
    </div>
  );
}
