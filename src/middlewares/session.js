const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redis = require("redis");

const redisClient = redis.createClient({ url: process.env.REDIS_URI });

const sessionMiddleware = (req, res, next) => {
  if (redisClient) {
    returnsession({
      store: new RedisStore({ client: redisClient, prefix: "myApp" }),
      secret: "this_secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      },
    });
  } else {
    next();
  }
};

module.exports = { sessionMiddleware };
