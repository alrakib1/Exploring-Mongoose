const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const port = 4000;

app.use(express.json());

// create a product schema

const productsSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create product model

const Product = mongoose.model("Products", productsSchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.url);
    console.log("db is connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

app.listen(port, async () => {
  console.log(`server running on port : ${port}`);
  await connectDB();
});

app.get("/", (req, res) => {
  res.send("Welcome to home page of the server");
});

app.post("/products", (req, res) => {
  try {

    
// get data from req body

    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;






    res.status(201).send({title, price, description});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
