const UserSignup = require("../models/userSignupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSignupController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if ([username, email, password].some((ele) => ele === "")) {
      return res.status(201).json({ errorMessage: "all fields are required!" });
    }

    const checkEmail = await UserSignup?.findOne({ email });
    if (checkEmail) {
      return res.status(201).json({ errorMessage: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserSignup.create({ username, email, password: hashedPassword });

    return res.status(200).json({ successMessage: "user created successfully!", userData: newUser });
  } catch (error) {
    console.log(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((ele) => ele === "")) {
      return res.status(201).json({ errorMessage: "all fields are required!" });
    }

    const findSameEmail = await UserSignup?.findOne({ email });

    if (!findSameEmail) {
      return res.status(201).json({ errorMessage: "user not found!" });
    }

    const checkPassword = await bcrypt.compare(password, findSameEmail.password);
    if (!checkPassword) {
      return res.status(201).json({ errorMessage: "incorrect password!" });
    }

    const generatedToken = await jwt.sign({ email }, process.env.PRIVATE_KEY, { expiresIn: "2h" });

    res.cookie("token", generatedToken, { httpOnly: true });

    return res.status(200).json({ successMessage: "user login successfully!", token: generatedToken, userData: findSameEmail });
  } catch (error) {
    console.log(error);
  }
};

const userFindAndUpdate = async (req, res, next) => {
  console.log("req.body---------------", req.body);
  try {
    const { id } = req.params;
    console.log("id----------------", id);
    const { username, email, password } = req.body.values;
    console.log("username, email, password---------------", username, email, password);

    if (!id) {
      return res.status(400).json({ errorMessage: "user was not found!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const findUser = await UserSignup?.findByIdAndUpdate(id, { username, email, password: hashedPassword }, { new: true });
    return res.status(200).json({ successMessage: "user update successfully!", data: findUser });
  } catch (error) {
    console.log(error);
  }
};

const userFindAndDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ errorMessage: "user not found!" });
    }

    const findUser = await UserSignup?.findOne({ id });
    if (!findUser) {
      return res.status(201).json({ errorMessage: "user not found!" });
    }

    const deletedUser = await UserSignup?.findByIdAndDelete(id);

    return res.status(200).json({ successMessage: "user deleted successfully!", data: deletedUser });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsersData = async (req, res, next) => {
  try {
    const getAllData = await UserSignup?.find();
    return res.status(200).json(getAllData);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { UserSignupController, userLogin, userFindAndUpdate, userFindAndDelete, getAllUsersData };
