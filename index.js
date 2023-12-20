const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a product schema (document)

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create product model (collection)

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

// Crud operation

// Create

app.post("/products", async (req, res) => {
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

// Read

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products) {
      return res.status(200).send({
        success: true,
        message: "return all products",
        data: products,
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Products not found",
    });
  }
});

// Get specific data by id (using query)

app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // const product = await Product.findOne({ _id: id }).select({title:1, price:1,_id:0});
    // const product = await Product.findOne({ _id: id },{title:1});

    const product = await Product.findOne({ _id: id });
    if (product) {
      return res.status(200).send({
        success: true,
        message: "return single product",
        data: product,
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Product not found",
    });
  }
});

// find will return an array and findOne will return an object

// adding select can filter which things you want to see from the object

//  we can also do the same thing inside find one after writing the object of id we can write another object inside find and give it key name and value of 1 to get only that  part from document , if we don't want to show anything then we can simply add value of that key as 0;



//  Comparison operator

app.get("/less", async (req, res) => {
  try {
    const products = await Product.find({ price: { $eq: 300 } });
    if (products) {
      return res.status(200).send({
        success: true,
        message: "return all products",
        data: products,
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Products not found",
    });
  }
});

//  we can add custom value to get products as per requirement with query. for example here we get the products that are less 300 .  have used $lt query for it.

// we can use gt to $get value that are greater than 300. If we want exactly same thing then we use $eq



