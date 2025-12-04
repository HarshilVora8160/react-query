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
  try {
    const { id: _id } = req.params;
    const { email, username } = req.body;

    if (!_id) {
      return res.status(400).json({ errorMessage: "user was not found!" });
    }

    const findUserByEmail = await UserSignup?.findOne({ email });
    
    if (findUserByEmail) {
      return res.status(201).json({ errorMessage: "user already exists!" });
    }
    
    const findUser = await UserSignup?.findByIdAndUpdate(_id, { email, username }, { new: true });
    
    return res.status(200).json({ successMessage: "user updated successfully!", data: findUser });
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

    const deletedUser = await UserSignup?.findByIdAndDelete(id);
    if(!deletedUser){
      return res.status(400).json({errorMessage:"user not found by id!"})
    }

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
