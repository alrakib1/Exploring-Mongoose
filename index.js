const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// create a product schema

const productsSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  },
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

app.post("/products", async(req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
    });

  const productData = await newProduct.save();

    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
