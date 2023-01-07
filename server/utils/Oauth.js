const axios = require('axios');
const dotenv = require("dotenv")

dotenv.config()

const queryString = require('query-string');

async function getAuthCode(code) {
  const { data } = await axios({
    url: 'https://github.com/login/oauth/access_token',
    method: 'get',
    params: {
      client_id: process.env.APP_ID,
      client_secret: process.env.APP_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code,
    },
  });
 
  const parsedData = queryString.parse(data);
//   console.log(parsedData); // { token_type, access_token, error, error_description }
  if (parsedData.error) return parsedData.error
  return parsedData.access_token;
};


module.exports = getAuthCode
