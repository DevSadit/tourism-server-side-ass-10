const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middelware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irm8dks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const spotCollection = client.db(`spotDB`).collection(`spot`);

    app.get(`/spotDetails`, async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get(`/spotDetails/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    app.post(`/spotDetails`, async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });

    app.put(`/spotDetails/:id`, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          averagecost: updatedSpot.averagecost,
          username: updatedSpot.username,
          Spotname: updatedSpot.Spotname,
          imgurl: updatedSpot.imgurl,
          countryname: updatedSpot.countryname,
          location: updatedSpot.location,
          desc: updatedSpot.desc,
          seasonality: updatedSpot.seasonality,
          totalVisitorsPerYear: updatedSpot.totalVisitorsPerYear,
          traveltime: updatedSpot.traveltime,
          useremail: updatedSpot.useremail,
        },
      };
      const result = await spotCollection.updateOne(filter, spot, option);
      res.send(result);
    });

    app.delete(`/spotDetails/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Server is Running`);
});
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
