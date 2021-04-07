const redis = require("redis");
const redisClient = redis.createClient(6379); // Redis server started at port 6379

// Cache middleware
function cacheMiddleware(key) {

  return function (req, res, next) {
    try {
      redisClient.get(req.query[key], (err, data) => {
        if (err) {
          console.error(err);
          throw err;
        }

        if (data) {
          res.status(200).send(JSON.parse(data));
        } else {
          next();
        }
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
}

function setCache(key, value) {
  redisClient.setex(key, 600, typeof value === 'object' ? JSON.stringify(value) : value);
}

module.exports = {
  cacheMiddleware,
  setCache
}
