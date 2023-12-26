import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import blob from "./assets/blobb.svg";
import blob2 from "./assets/blobb2.svg";
import blob3 from "./assets/blobb3.svg";
import { FiTwitter, FiGithub } from "react-icons/fi";

type Props = {};

export default function Home({}: Props) {
  // localStorage.clear()

  return (
    <div className="hero padding-sm">
      <div className="glass1"></div>
      <img className="blob blob1" src={blob} alt="wave" />
      <div className="glass2"></div>
      <img className="blob blob2" src={blob2} alt="wave" />

      <h1>
        welcome to codequip<em>.</em>
      </h1>
      <p>Where Commits Meet Conversations - Share Your Genius, One Commit at a Time!</p>
      <p>
        {" "}
        Use the keyword <b>tweet: </b>in your commits
      </p>
      <p className="code">
        git commit -m "tweet: I just added this amazing feature that I had to
        share!"
      </p>
      <span>
        <a href="https://github.com/login/oauth/authorize?allow_signup=true&client_id=78e4180c3b7b6aeb4ea7&redirect_uri=https://codequip.netlify.app/authorized/streak&scope=public_repo">
          <button>
            Connect with Github <FiGithub style={{ marginLeft: 10 }} />{" "}
          </button>
        </a>
      </span>
    </div>
  );
}
