import image from "./assets/boy.jfif";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiTwitter, FiGithub } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Bars, RevolvingDot } from "react-loader-spinner";

type Props = {};

export default function ListRepo({}: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [repos, setRepo] = useState<any>([]);
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [connectStatus, setConnectStatus] = useState<boolean>(false);
  const search = useLocation().search;
  localStorage.removeItem("streakbot_access");

  useEffect(() => {
    console.log("Running")
    const saved_token = localStorage.getItem("streakbot_token");
    console.log(saved_token)
    if (saved_token) {
      // logged in
      axios
        .post(`https://streakbotx.onrender.com/loggedin/?token=${saved_token}`)
        .then((response) => {
          console.log(response);
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
          .post(`https://streakbotx.onrender.com/auth/?code=${code}`)
          .then((response) => {
            console.log(response);
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
            .post(
              `https://streakbotx.onrender.com/update/?token=${access}&login=${name}`
            )
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
  const handleConnect = async (event: any,repo_name: string) => {
    // console.log(`https://api.github.com/repos/${repo_name}/hooks`);
    if (connectStatus) {
      setLoading(true);
      toast.info("Setting up... please wait", {
        closeButton: false,
        autoClose: 2500,
      });
      axios
        .post(
          `https://streakbotx.onrender.com/webhook/?link=https://api.github.com/repos/${repo_name}/hooks&token=${token}`
        )
        .then((response) => {
          console.log(response);
          if (response.data != "success") {
            setLoading(false)
            toast.info("You've already added this repo to your Streakbot!", {
              closeButton: false,
              autoClose: 2500,
            });
          } else {
            toast.success("Success!", {
              closeButton: false,
              autoClose: 2500,
              onClose: () => {
                navigate("/streaker");
              },
            });
          }
        });
    } else {
      toast.warning("Please connect your Twitter account!", {
        closeButton: false,
      });
    }
  };

  return (
    <div className="list reduce-font">
      <div className="header">
        <h2>Setup Streakbot</h2>
        <div className="profile">
          {avatar ? (
            <>
              <img src={avatar} alt="" />
              <h3>{name}</h3>
            </>
          ) : (
            <RevolvingDot
              height="100"
              width="100"
              radius={20}
              color="#fff"
              secondaryColor=""
              ariaLabel="revolving-dot-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          )}
        </div>
      </div>
      <div className="connect_twitter">
        <a href="https://streakbotx.onrender.com/tweet/v2">
          <button className="twitter_btn">
            {connectStatus ? "Connected" : "Connect with Twitter"}{" "}
            <FiTwitter style={{ marginLeft: 10 }} />{" "}
          </button>
        </a>
      </div>
      <div className="repos">
        <h2> Select a repository to connect to</h2>
        {avatar ? (
          <ul className="w-full">
            {repos.map((repo: any, index: number) => {
              return (
                <li key={index}>
                  <h4>{repo.full_name}</h4>
                  <button disabled={loading}  onClick={() => handleConnect(event,repo.full_name)}>
                      Connect
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <Bars
            height="50"
            width="50"
            color="#fff"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
      </div>
    </div>
  );
}
