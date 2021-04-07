const axios = require("axios");
const express = require("express");
const { cacheMiddleware, setCache } = require("./cache-middleware");

const app = express();
const MOCK_API = "https://jsonplaceholder.typicode.com/users/";

app.get("/users", (req, res) => {
  const email = req.query.email;

  try {
    axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
      const users = response.data;

      console.log("User successfully retrieved from the API");

      res.status(200).send(users);
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/cached-users", cacheMiddleware('email'), (req, res) => {
  const email = req.query.email;

  try {
    axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
      const users = response.data;

      console.log("User successfully retrieved from the API");

      // set redis cache
      setCache(email, users);

      res.status(200).send(users);
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
