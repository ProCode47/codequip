import image from "./assets/boy.jfif";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiTwitter, FiGithub } from "react-icons/fi";

type Props = {};

export default function ListRepo({}: Props) {
  const [repos, setRepo] = useState<any>([]);
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const search = useLocation().search;

  useEffect(() => {
    const saved_token = localStorage.getItem("token");
    if (saved_token) {
      // logged in
      axios
        .post(`http://localhost:5000/loggedin/?token=${saved_token}`)
        .then((response) => {
          // console.log(response);
          setRepo(response.data.repos);
          setName(response.data.user.login);
          setAvatar(response.data.user.avatar_url);
          setToken(saved_token);
          console.log(saved_token);
        });
    } else {
      const code = new URLSearchParams(search).get("code");
      if (code) {
        axios
          .post(`http://localhost:5000/auth/?code=${code}`)
          .then((response) => {
            // console.log(response);
            setRepo(response.data.repos);
            setName(response.data.user.login);
            setAvatar(response.data.user.avatar_url);
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            console.log(response.data.token);
          });
      }
    }
  }, []);
  const handleConnect = async (repo_name: string) => {
    // console.log(`https://api.github.com/repos/${repo_name}/hooks`);
    axios
      .post(
        `http://localhost:5000/webhook/?link=https://api.github.com/repos/${repo_name}/hooks&token=${token}`
      )
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <div className="list">
      <div className="header">
        <h2>Setup Streakbot</h2>
        <div className="profile">
          <img src={avatar} alt="" />
          <h3>{name}</h3>
        </div>
      </div>
      <div className="connect_twitter">
        <a href="http://localhost:5000/tweet/v2">
          <button className="twitter_btn">
            Connect with Twitter <FiTwitter style={{ marginLeft: 10 }} />{" "}
          </button>
        </a>
      </div>
      <div className="repos">
        <h2> Select a repository to connect to</h2>
        <ul>
          {repos.map((repo: any, index: number) => {
            return (
              <li key={index}>
                <h4>{repo.full_name}</h4>
                <button onClick={() => handleConnect(repo.full_name)}>
                  Connect
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
