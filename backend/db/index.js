const mongoose = require("mongoose");

const DbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("mongodb connected!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = DbConnect;
