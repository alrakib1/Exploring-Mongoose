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
    required: [true, "product title is required"],
    minLength: [3, "minimum title length should be 3"],
    maxLength: [20, "maximum title length should be 10"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [50, "minimum price should be 50"],
    max: [2000, "maximum price should be 2000"],
  },
  rating: {
    type: Number,
    required: true,
  },
  
  // email: {
  //   type: String,
  //   unique: true,  //for email validation we can use unique true for user data
  // }
  // ,
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
  console.log(`server running on: http://localhost:${port}`);
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
    } else {
      res.status(404).send({
        success: false,
        message: "Product not found with this id",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
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

    // const price = 400; // used fixed value for testing
    const price = req.query.price;
    const rating = req.query.rating;

    let products;
    // console.log(req.query)
    if (price && rating) {
      products = await Product.find({
        $and: [{ price: { $gte: price } }, { rating: { $gte: rating } }],
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
      }).countDocuments();
    } else {
      products = await Product.find().sort({ price: 1 });
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

    const price = req.query.price;
    const rating = req.query.rating;

    let products;
    // console.log(req.query)
    if (price) {
      products = await Product.find({
        $nor: [{ price: { $gte: price } }, { rating: { $gte: rating } }],
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

//  we can count total document using document count at the end of the find method.

// sort

app.get("/sort", async (req, res) => {
  try {
    // const price = req.query.price;

    const price = 400; // used fixed value for testing

    let products;
    // console.log(req.query)
    if (price) {
      products = await Product.find({
        $or: [{ price: { $gte: price } }, { rating: { $gte: 4 } }],
      })
        .sort({ price: -1 })
        .select({ title: 1, _id: 0 });
    } else {
      products = await Product.find().sort({ price: -1 }); //sorted the response  data based on the price of the document (value: 1 is acceding and -1 is descending in order) we can also add select here to project only those part of the data we want
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

//  delete document

// delete single data

app.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete({ _id: id }); //simple delete method
    if (product) {
      res.status(200).send({
        success: true,
        message: "single product deleted",
        data: product,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Products not deleted with this id",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// deleteOne only return that product was deleted. but findByIdAndDelete return which product was deleted.

// update

// put

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          rating: req.body.rating,
          price: req.body.price,
        },
      },
      {
        new: true,
      }
    );
    if (updatedProduct) {
      res.status(200).send({
        success: true,
        message: "single product updated",
        data: updatedProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Product was not updated with this id",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// updateOne one only return that product was updated. but findByIdUpdate return which product was updated by default it won't show realtime modified data. we have to add {new: true} at the end of it
