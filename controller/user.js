import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
require("dotenv").config();

export const registerUser = async (req, res) => {
  const { email, password, fname, lname } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and Password Required" });
  const hashedPassWord = await bcrypt.hash(password, 10);

  const duplicateCheck = await User.find({ email: email })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error while searching for a user", error: error });
    });

  if (duplicateCheck.length) {
    res.status(409).json({ message: "already have a user" });
  } else {
    await User.create({
      email: email,
      password: hashedPassWord,
      fname: fname,
      lname: lname,
    })
      .then((result) => {
        return res.status(200).json({ result });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ message: "Error while creating a user", error: error });
      });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and Password Required" });
  const foundUser = await User.findOne({ email: email })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error while searching for a user", error: error });
    });

  if (foundUser) {
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (matchPassword) {
      const accessToken = jwt.sign(
        {
          email: foundUser.email,
          userId: foundUser._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        {
          email: foundUser.email,
          userId: foundUser._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      if (foundUser.token === "loggedOut") {
        await User.findByIdAndUpdate(
          { _id: foundUser._id },
          { token: refreshToken },
          {
            new: true,
            upsert: true, // Make this update into an upsert
          }
        )
          .then((response) => {
            res.status(200).json({
              userId: foundUser._id,
              token: accessToken,
              refresh: refreshToken,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Error while updating the token",
              error: error,
            });
          });
      } else {
        res.status(200).json({
          userId: foundUser._id,
          token: accessToken,
          refresh: foundUser.token,
        });
      }
    } else {
      res.status(401).json({ message: "Password Missmatch!" });
    }
  } else {
    res.status(404).json({ message: "User notfound!" });
  }
};

export const currentUser = async (req, res) => {
  const email = req.email;
  const filter = { email: email };
  await User.findOne(filter)
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
