import("dotenv").then((dotenv) => {
  dotenv.config();
});

export default {
  PORT: process.env.PORT,
  DBURI: process.env.MONGO_EXPRESS_STRING,
  DOMAIN: process.env.DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET,
};
