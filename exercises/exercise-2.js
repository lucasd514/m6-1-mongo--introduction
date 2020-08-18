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

const newFunction = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const start = req.query.start;
  const end = req.query.limit;
  console.log(start, end);
  await client.connect();
  const db = client.db("exercise_1");
  const allGreetings = await db.collection("greetings").find().toArray();

  if (allGreetings.length > 25 && start && end) {
    res
      .status(200)
      .json({ status: 200, theseAreAllOfThem: allGreetings.slice(start, end) });
    console.log("this starts at:", start, "and ends at:", end);
    client.close();
  }
  if (allGreetings.length > 25 && start) {
    const localEnd = start + 25;
    res.status(200).json({
      status: 200,
      theseAreAllOfThem: allGreetings.slice(start, localEnd),
    });
    console.log("this starts at:", start, "and ends at:", localEnd);
    client.close();
  }
  if (allGreetings.length > 25 && end) {
    res.status(200).json({
      status: 200,
      theseAreAllOfThem: allGreetings.slice(0, end),
    });
    console.log("and ends at:", end);
    client.close();
  }
  if (allGreetings.length > 25 && start + end > allGreetings.length) {
    const lastTen = allGreetings.length - 10;

    res.status(200).json({
      status: 200,
      theseAreAllOfThem: allGreetings.slice(lastTen, allGreetings.length),
    });
    console.log("too much");
    client.close();
  }
};

const deleteGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const _id = req.params.id;
    const greetings = await db.collection("greetings").deleteOne({ _id: _id });
    console.log(greetings);
    assert.equal(1, greetings.deletedCount);
    client.close();

    res.status(204).json({ status: 204, message: "message deleted" });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;
  const hello = req.body;
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db("exercise_1");
    const newValues = { $set: hello };
    if (req.body.hello === undefined) {
      throw new Error("Missing info");
    }
    const greetings = await db
      .collection("greetings")
      .updateOne({ _id }, newValues);
    assert.equal(1, greetings.matchedCount);
    assert.equal(1, greetings.modifiedCount);
    res.status(200).json({ status: 200, data: { _id, hello } });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, data: { ...req.body }, message: err.message });
  }
  client.close();
};
module.exports = {
  getGreeting,
  createGreeting,
  newFunction,
  deleteGreeting,
  updateGreeting,
};
