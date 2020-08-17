const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res, dbName) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  const users = await db.collection("users").find().toArray();
  if (users === []) {
    res.status(404);
  } else {
    res.status(200).json({ status: 200, info: users });
  }
  console.log(users);
  client.close();
};

module.exports = { getUsers };
