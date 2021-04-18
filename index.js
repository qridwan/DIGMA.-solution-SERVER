const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q83cw.mongodb.net/${process.env.DB_DbName}?retryWrites=true&w=majority`;

app.get("/", (req, res) => {
  res.send("Server is Running");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client
    .db(`${process.env.DB_DbName}`)
    .collection(`${process.env.DB_COLLECTION}`);

  const reviewCollection = client
    .db(`${process.env.DB_DbName}`)
    .collection("reviews");

  const adminCollection = client
    .db(`${process.env.DB_DbName}`)
    .collection("admin");

  const ordersCollection = client
    .db(`${process.env.DB_DbName}`)
    .collection("orders");

  //add as a admin
  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    console.log(
      "🚀 ~ file: index.js ~ line 34 ~ app.post ~ newAdmin",
      newAdmin
    );
    adminCollection
      .insertOne(newAdmin)
      .then((result) => {
        console.log("success");
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //adding single service
  app.post("/addService", (req, res) => {
    const newService = req.body;
    serviceCollection
      .insertOne(newService)
      .then((result) => {
        console.log("success");
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  //adding single ORDER
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    ordersCollection
      .insertOne(newOrder)
      .then((result) => {
        console.log("success");
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //getting orders by email
  app.get("/order/:email", (req, res) => {
    ordersCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        console.log(documents);
        res.send(documents);
      });
  });

  //getting order by their Id
  app.get("/orders/:id", (req, res) => {
    console.log(req.params.id);
    ordersCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        console.log(documents[0]);
        res.send(documents[0]);
      });
  });

  //Update data in the database
  app.patch("/update/:id", (req, res) => {
    ordersCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.status },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
        console.log(result.modifiedCount);
      });
  });

  //searching admin by email
  app.get("/isAdmin/:email", (req, res) => {
    adminCollection
      .find({ email: req.params.email })
      .toArray((err, documents) => {
        console.log(documents[0]);
        res.send(documents[0]);
      });
  });

  //getting all services
  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  //getting all orders
  app.get("/allOrders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //getting specific service items from DB
  app.get("/service/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        console.log(documents[0]);
        res.send(documents[0]);
      });
  });

  //adding review in DATABASE
  app.post("/addReview", (req, res) => {
    const newReview = req.body;
    reviewCollection
      .insertOne(newReview)
      .then((result) => {
        console.log("succeeded");
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //getting all reviews
  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // deleting single service from DB
  app.delete("/deleteService/:id", (req, res) => {
    console.log(req.params.id);
    serviceCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result.deletedCount > 0))
      .catch((err) => console.log(err));
  });

  console.log(" ======DATABASE-CONNECTED======");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Node is ready`);
});
