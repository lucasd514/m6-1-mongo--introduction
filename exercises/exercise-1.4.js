const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { name } = req.body;

  await client.connect();

  const db = client.db("exercise_1");

  await db.collection("users").insertOne({ name });
  const users = await db.collection("users").find().toArray();
  if (users === []) {
    res.status(404);
  } else {
    res.status(200).json({ status: 200, info: users });
  }
  console.log(users);
  client.close();
};

module.exports = { addUser };
