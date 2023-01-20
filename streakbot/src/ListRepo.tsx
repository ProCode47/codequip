import image from "./assets/boy.jfif";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiTwitter, FiGithub } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function ListRepo({}: Props) {
  const navigate = useNavigate();
  const [repos, setRepo] = useState<any>([]);
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [connectStatus, setConnectStatus] = useState<boolean>(false);
  const search = useLocation().search;
  localStorage.removeItem("streakbot_access");

  useEffect(() => {
    const saved_token = localStorage.getItem("streakbot_token");
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
            localStorage.setItem("streakbot_token", response.data.token);
            console.log(response.data.token);
          });
      }
    }
  }, []);
  useEffect(() => {
    if (name) {
      const saved_access = localStorage.getItem("streakbot_access");
      if (saved_access != null) {
        setConnectStatus(true);
        console.log("saved access");
      } else {
        console.log("no saved access");
        const access = new URLSearchParams(search).get("access");
        if (access) {
          axios
            .post(`http://localhost:5000/update/?token=${access}&login=${name}`)
            .then((response) => {
              console.log(response);
            });
          localStorage.setItem("streakbot_access", access);
          console.log("saving access");
          setConnectStatus(true);
        }
      }
    }
  }, [name]);
  const handleConnect = async (repo_name: string) => {
    // console.log(`https://api.github.com/repos/${repo_name}/hooks`);
    if (connectStatus) {
      axios
        .post(
          `http://localhost:5000/webhook/?link=https://api.github.com/repos/${repo_name}/hooks&token=${token}`
        )
        .then((response) => {
          // console.log(response);
          toast.success("Success!", {
            closeButton: false,
            autoClose:2500,
            onClose: () => {
              navigate("/streaker");
            },
          });
        });
    } else {
      toast.warning("Please connect your Twitter account", {
        closeButton: false,
      });
    }
  };

  return (
    <div className="list">
      <ToastContainer style={{ width: "fit-content", paddingRight: "10px" }} />
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
            {connectStatus ? "Connected" : "Connect with Twitter"}{" "}
            <FiTwitter style={{ marginLeft: 10 }} />{" "}
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
