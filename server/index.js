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
      const getRepos = async () => {
        const response = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        console.log(response.data);
        res.json(response.data);
      };

      getRepos();
    })
    .catch((err) => {
      res.json({ err });
    });
});

//Listen
app.listen(PORT, () => {
  console.log("Server is running...");
});
