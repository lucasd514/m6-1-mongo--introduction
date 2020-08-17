const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const dbFunction = async (dbName) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);
  //   // connect to the client
  await client.connect();
  //   // connect to the database (db name is provided as an argument to the function)
  const db = client.db(dbName); // <-- changed this as well
  console.log("connected!");
  //   // close the connection to the database server
  client.close();
  console.log("disconnected!");
};

const getCollection = async (dbName) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db(dbName);
  const users = await db.collection("users").find().toArray();
  console.log(users);
  client.close();
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const greetings = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, greetings.insertedCount);
    client.close();

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const getGreeting = async (req, res) => {
  const _id = req.params.id;
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();

  console.log(_id);
  const db = client.db("exercise_1");
  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

module.exports = { getGreeting, createGreeting };
