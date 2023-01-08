const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const Oauth = require("./utils/Oauth");
const axios = require("axios");

//Configuring Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// main route
app.post("/auth", (req, res) => {
  const code = req.query.code;
  Oauth(code)
    .then((token) => {
      console.log({ token });
      const getUserInfo = async () => {
        const repos = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const user = await axios.get("https://api.github.com/user", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const payload = { repos: repos.data, user: user.data, token };
        console.log(payload);
        res.json(payload);
      };

      getUserInfo();
    })
    .catch((err) => {
      res.json({ err });
    });
});
app.post("/loggedin", (req, res) => {
  const token = req.query.token;
  const getUserInfo = async () => {
    const repos = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const user = await axios.get("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    const payload = { repos: repos.data, user: user.data };
    console.log(payload);
    res.json(payload);
  };

  getUserInfo();
});
app.post("/webhook", (req, res) => {
  const link = req.query.link;
  const token = req.query.token;
  const data = {
    name: "web",
    active: true,
    events: ["push"],
    config: {
      url: "https://example.com/webhook",
      content_type: "json",
      insecure_ssl: "0",
    },
  };
  const headers = {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
  };
  const setHook = async () => {
    const response = await axios.post(link, data, headers);
    console.log(response);
    console.log("hit");
  };
  setHook();
});
//Listen
app.listen(PORT, () => {
  console.log("Server is running...");
});
