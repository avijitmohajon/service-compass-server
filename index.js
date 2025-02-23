require("dotenv").config(); 
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware for enabling CORS and parsing JSON data
app.use(cors());
app.use(express.json());

// MongoDB URI from environment variables
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.wye4e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Hey developer. You successfully connected to MongoDB successfully!");

    // Service and Review Collections
    const serviceCollection = client.db("servicesDatabase").collection("services");
    const reviewCollection = client.db("servicesDatabase").collection("reviews");

    // Get all services
    app.get("/services", async (req, res) => {
      try {
        const result = await serviceCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch services' });
      }
    });

    // Get a specific service by ID with validation for ObjectId format
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid service ID" });
      }
      const query = { _id: new ObjectId(id) };
      try {
        const result = await serviceCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ error: 'Service not found' });
        }
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch the service' });
      }
    });

    // Get all reviews for a specific service
    app.get("/reviews", async (req, res) => {
      const { serviceId } = req.query;
      if (!serviceId) {
        return res.status(400).send({ error: "Service ID is required" });
      }
      try {
        const reviews = await reviewCollection.find({ serviceId }).toArray();
        res.send(reviews);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch reviews' });
      }
    });

    // reviews submitted by a specific user
    app.get("/user-reviews", async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).send({ error: "User email is required" });
      }
      try {
        const userReviews = await reviewCollection.find({ email }).toArray();
        res.send(userReviews);
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user reviews' });
      }
    });

    // count of all users
    app.get("/users/count", async (req, res) => {
      try {
        const usersCollection = client.db("servicesDatabase").collection("users");
        const userCount = await usersCollection.countDocuments();
        res.send({ count: userCount });
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user count' });
      }
    });

    // count of all reviews
    app.get("/reviews/count", async (req, res) => {
      try {
        const reviewCount = await reviewCollection.countDocuments();
        res.send({ count: reviewCount });
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch review count' });
      }
    });

    // count of all services
    app.get("/service/count", async (req, res) => {
      try {
        const serviceCount = await serviceCollection.countDocuments();
        res.send({ count: serviceCount });
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch service count' });
      }
    });

    // Post a new service
    app.post("/services", async (req, res) => {
      const newService = req.body;
      try {
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to add service' });
      }
    });

    // Add a new review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      if (!review.serviceId || !review.userName || !review.reviewText || !review.rating) {
        return res.status(400).send({ error: "Missing required review fields" });
      }
      try {
        const result = await reviewCollection.insertOne(review);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to add review' });
      }
    });

    // Update a review by its ID
    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid review ID" });
      }
      const { reviewText, rating } = req.body;
      try {
        const result = await reviewCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { reviewText, rating } }
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to update review' });
      }
    });

    // Delete a review by  ID
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid review ID" });
      }
      try {
        const result = await reviewCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Failed to delete review' });
      }
    });

    // Delete a service by its ID
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid service ID" });
      }
      try {
        const result = await serviceCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.send({ message: "Service deleted successfully" });
        } else {
          res.status(404).send({ error: "Service not found" });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to delete service" });
      }
    });

    // Update a service by its ID
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id; // Service ID from URL
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid service ID" });
      }

      const { title, category, price, image } = req.body; // New service data

      // Validate that the required fields are provided
      if (!title || !category || !price || !image) {
        return res.status(400).send({ error: "Missing required fields" });
      }

      try {
        // Find and update the service by ID
        const updatedService = await serviceCollection.updateOne(
          { _id: new ObjectId(id) }, // Query by service ID
          { $set: { title, category, price, image } } // Update the service data
        );

        // Check if the service was found and updated
        if (updatedService.modifiedCount === 0) {
          return res.status(404).send({ error: "Service not found or no changes made" });
        }

        // Return the updated service
        const service = await serviceCollection.findOne({ _id: new ObjectId(id) });
        res.send(service); // Send the updated service data
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to update service" });
      }
    });
  } finally {
    // Ensure the client will close when you finish/error
    // await client.close();
  }
}

// Run the MongoDB connection function
run().catch(console.dir);

// Simple route to check if the server is running
app.get("/", (req, res) => {
  res.send("Service server is running");
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Service server is running on port :${port}`);
});
