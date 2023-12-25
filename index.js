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
  rating: {
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

// connect to mongodb using function

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.url);
    console.log("Mongodb is connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

//

app.listen(port, async () => {
  console.log(`server running on port : ${port}`);
  await connectDB(); //connect to db after server has started
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
      rating: req.body.rating,
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
    const price = req.query.price;
    let products;
    // console.log(req.query)
    if (price) {
      products = await Product.find({ price: { $lt: price } });
    } else {
      products = await Product.find();
    }
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

// logical operator

// lets say if we need multiple condition to find data then we can use logical operator.  all logic must be inside an array as an array of object and wrap it with another object.

// $and operator

// In this case, I want to search a product which has price of 500 or more and rating of 4 or more. the logic will be:

// {$and:[{ price: { $gte: price } },{rating: {$gte: 4}}]}    //simply pass this condition to find operator and see . all logic have to be true for this response

app.get("/and", async (req, res) => {
  try {
    // const price = req.query.price;

    const price = 400; // used fixed value for testing

    let products;
    // console.log(req.query)
    if (price) {
      products = await Product.find({
        $and: [{ price: { $gte: price } }, { rating: { $gte: 4 } }],
      });
    } else {
      products = await Product.find();
    }
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

// $or operator

// if we have multiple condition and if anyone of them is true then it will return response

// {$or:[{ price: { $gte: price } },{rating: {$gte: 4}}]}     //if any of the one condition is true then it will send the data

app.get("/or", async (req, res) => {
  try {
    // const price = req.query.price;

    const price = 400; // used fixed value for testing


    let products;
    // console.log(req.query)
    if (price) {
      products = await Product.find({
        $or: [{ price: { $gte: price } }, { rating: { $gte: 4 } }],
      });
    } else {
      products = await Product.find();
    }
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


// $nor 

// nor will return data which have don't have either of the condition

app.get("/nor", async (req, res) => {
  try {
    // const price = req.query.price;

    const price = 400; // used fixed value for testing


    let products;
    // console.log(req.query)
    if (price) {
      products = await Product.find({
        $nor: [{ price: { $gte: price } }, { rating: { $gte: 4 } }],
      });
    } else {
      products = await Product.find();
    }
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