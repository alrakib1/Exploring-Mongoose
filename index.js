const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const port = 4000;

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
