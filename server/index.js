const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const Oauth = require("./utils/Oauth");
const axios = require("axios");
const Twit = require("twit");
const util = require("util");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON
);

dotenv.config();
//Configuring Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const callbackURL = "http://127.0.0.1:5000/";
const TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

//test route
// app.get("/test", (req, res) => {
//   res.send("Aye mate");
// });

// github routes
app.post("/auth", (req, res) => {
  const code = req.query.code;
  Oauth(code)
    .then((token) => {
      // console.log({ token });
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
        // console.log(payload);
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
    // console.log(payload);
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
      url: "https://9ec4-197-210-85-40.eu.ngrok.io/tweet",
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

// github-to-twitter- routes
app.post("/tweet", async (req, res) => {
  // require("child_process").spawn("clip").stdin.end(util.inspect(req.body));
  // use req.body.sender.login for identifier
  // find the access/ refresh tokens for user
  const author = req.body.sender.login;
  const { data, error } = await supabase
    .from("tokens")
    .select("access", "refresh")
    .order("id", { ascending: false })
    .eq("login", author)
    .limit(1);
  if (err) {
    console.log(error);
  } else {
    console.log(data);
  }

  // const tweet = req.body.commits[0].message;
  // const link = req.body.commits[0].url;
  // if (tweet.includes("tweet:")) {
  //   const updatedTweet = tweet.replace("tweet:", "");
  //   const Twitter = new Twit({
  //     consumer_key: "9u3FA6YzQaCkBj0I2zL3KnZdZ",
  //     consumer_secret: "OJz4FqXtbw9PMxyRSIMeKYvMqf67KeO49YXtdzsJczWKA33kv8",
  //     access_token: "1468834737829474305-mlxfdT7a0LZ6lWiT3DuxtngBag3TJD",
  //     access_token_secret: "xbmT46GIcde04BeQgUZT2el8aoYOr9Xh3JUAE2fUkHd2j",
  //     timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  //   });

  //   var params = {
  //     status: `#automatedbystreakbot \n ${updatedTweet} \n ${link}`,
  //   };

  //   function tweetResult(err, data, response) {
  //     if (err) {
  //       console.log({ err });
  //     } else {
  //       console.log("tweet successful");
  //     }
  //   }

  //   Twitter.post("statuses/update", params, tweetResult);
  // }
});

// streakbot v2 routes
app.get("/tweet/v2", async (req, res) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    callbackURL,
    { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] }
  );
  res.redirect(url);
  // console.log({ codeVerifier, state });
  const { error } = await supabase
    .from("codes")
    .insert({ code_verifier: codeVerifier, state });
  if (error) {
    console.log(error);
  }
});

app.get("/", async (req, res) => {
  const { code, state } = req.query;
  // fetch code verifier from db
  const { data, error } = await supabase
    .from("codes")
    .select()
    .eq("state", state);
  // obtain  access tokens
  if (!error) {
    const codeVerifier = data[0].code_verifier;
    const { client, accessToken, refreshToken } =
      await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: callbackURL,
      });
    // save access tokens
    const { error } = await supabase
      .from("tokens")
      .insert({ access: accessToken, refresh: refreshToken });
    if (error) {
      console.log(error);
    } else {
      res.redirect(
        `http://127.0.0.1:5173/authorized/streak?access=${accessToken}`
      );
    }
  } else {
    console.log("User state doesn't exist");
    res.send({ saved_state_error: error });
  }
});
app.post("/update", async (req, res) => {
  const { token, login } = req.query;
  // update row with login data
  let update = {
    login: login,
  };
  const { data, error } = await supabase
    .from("tokens")
    .select()
    .eq("access", token);
  if (!data[0].login) {
    const { data, error } = await supabase
      .from("tokens")
      .update(update)
      .eq("access", token);
    if (!error) {
      console.log("Update successful");
    } else {
      console.log(error);
    }
  }
});
//Listen
app.listen(PORT, () => {
  console.log("Server is running...");
});
