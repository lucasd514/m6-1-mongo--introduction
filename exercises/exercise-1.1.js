const { MongoClient } = require("mongodb");

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

  await db.collection("users").insertOne({ name: "Daniele De Rossi" });

  //   // close the connection to the database server
  client.close();
  console.log("disconnected!");
};
dbFunction("exercise_1");
