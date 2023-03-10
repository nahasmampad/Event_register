const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Register = require("../models/registerMode");
const Seat = require("../models/seatModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    console.log(req.body, "ghjk");
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "user alredy exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newuser = new User(req.body);
    await newuser.save();
    res
      .status(200)
      .send({ message: "user created successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login Successfull", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error Login In", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  console.log(req.body.userId);
  try {
    const user = await User.findOne({ _id: req.body.userId });
    console.log(user);

    



    if (!user) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
        },
      });


    }
    


  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting uder info", success: false, error });
  }
});

router.post("/bookSloat", authMiddleware, async (req, res) => {
  console.log(req.body);

  try {
    const newRegister = new Register(req.body);
    await newRegister.save();
    res
      .status(200)
      .send({ message: "Your registration was successful!", success: true });
  } catch (error) {}
});

router.post("/bookingDetails", authMiddleware, async (req, res) => {
  try {
    const data = await Register.findOne({ userId: req.body.userId });

    res.status(200).send({ success: true, data });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting uder info", success: false, error });
  }
});

module.exports = router;
