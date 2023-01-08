const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const Oauth = require("./utils/Oauth");
const axios = require("axios");
const Twit = require("twit");
const util = require("util");

//Configuring Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//test route
app.get("/test", (req, res) => {
  res.send("Aye mate")
})
// github routes
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
      url: "https://5174-197-210-55-51.eu.ngrok.io/tweet",
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
    // console.log(response);
    res.json(response.data);
  };
  setHook();
});

// twitter routes
app.post("/tweet", (req, res) => {
  console.log(req.body)
  console.log(Object.keys(req.body))
  console.log(req.body.commits[0].message)
  // const Twitter = new Twit({
  //   consumer_key: "9u3FA6YzQaCkBj0I2zL3KnZdZ",
  //   consumer_secret: "OJz4FqXtbw9PMxyRSIMeKYvMqf67KeO49YXtdzsJczWKA33kv8",
  //   access_token: "1468834737829474305-mlxfdT7a0LZ6lWiT3DuxtngBag3TJD",
  //   access_token_secret: "xbmT46GIcde04BeQgUZT2el8aoYOr9Xh3JUAE2fUkHd2j",
  //   timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  // });

  // var params = {
  //   status: "testing twitter api",
  // };

  // function tweetResult(err, data, response) {
  //   console.log(data);
  // }

  // Twitter.post("statuses/update", params, tweetResult);

});


//Listen
app.listen(PORT, () => {
  console.log("Server is running...");
});
