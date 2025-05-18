const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
// task-management-DB-user
// zFS2mXTn8bk89Ct7
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fe99gj2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("task_management_DB");
    const taskCollection = database.collection("tasks");

    app.get("/tasks", async (req, res) => {
      const { searchParams } = req.query;
      let query = {};
      if (searchParams) {
        query = { title: { $regex: searchParams, $options: "i" } };
      }
      const cursor = taskCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.findOne(query);
      res.send(result);
    });

    app.post("/tasks", async (req, res) => {
      const tasksData = req.body;
      const result = await taskCollection.insertOne(tasksData);
      res.send(result);
      //   console.log(tasksData);
    });

    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: task,
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is task management home server");
});

app.listen(port, () => {
  console.log(`task management app listening on port ${port}`);
});
