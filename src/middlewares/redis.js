const { createClient } = require("redis");
const hash = require("object-hash");
const zlib = require("node:zlib");

let redisClient = undefined;

async function initializedRedisClient() {
  let redisUrl = process.env.REDIS_URI;

  if (redisUrl) {
    redisClient = createClient({ url: redisUrl }).on("error", (e) => {
      console.error("Failed to create the redis client with error: ");
      console.log(e);
    });

    try {
      await redisClient.connect();
      console.log("Connect to redis was succesfully");
    } catch (err) {
      console.log("Connection redis failed with eror: ");
      console.log(err);
    }
  }
}

function requestToKey(req) {
  const reqDataToHash = {
    query: req.query,
    body: req.body,
  };
  return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

function isRedisIsWorking() {
  return !!redisClient?.isOpen;
}

async function writeData(key, data, option, compress) {
  if (isRedisIsWorking()) {
    let dataToCache = data;
    if (compress) {
      dataToCache = zlib.deflateSync(data).toString("base64");
    }
    try {
      await redisClient.set(key, dataToCache, option);
    } catch (err) {
      console.error(`Failed to cache data for key=${key}`, err);
    }
  }
}

async function readData(key, compress) {
  let cachedValue = undefined;
  if (isRedisIsWorking()) {
    cachedValue = await redisClient.get(key);
    if (cachedValue) {
      if (compress) {
        return zlib.inflateSync(Buffer.from(cachedValue, "base64")).toString();
      } else {
        return cachedValue;
      }
    }
  }
  return cachedValue;
}

function redisCacheMiddleware(
  options = {
    EX: 21600,
  },
  compress = true
) {
  return async (req, res, next) => {
    if (isRedisIsWorking()) {
      const key = requestToKey(req);
      const cachedValue = await readData(key, compress);
      if (cachedValue) {
        try {
          return res.json(JSON.parse(cachedValue));
        } catch {
          return res.send(cachedValue);
        }
      } else {
        const oldSend = res.send;
        res.send = function (data) {
          res.send = oldSend;
          if (res.statusCode.toString().startsWith("2")) {
            writeData(key, data, options, compress).then();
          }

          return res.send(data);
        };
        next();
      }
    } else {
      next();
    }
  };
}

module.exports = {
  redisClient,
  isRedisIsWorking,
  initializedRedisClient,
  redisCacheMiddleware,
};
