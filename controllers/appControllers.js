import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config.js";
import otpGenerator from "otp-generator";
import { asyncWrapper } from "../middleware/async.js";
import {  createCustomError } from '../error/custom-error.js';

/** middleware for verify user */
const verifyUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.method == "GET" ? req.params : req.body;
  // check the user existance
  let exist = await UserModel.findOne({ _id:id });
  if (!exist) return res.status(404).send({ error: "Can't find User!" });
  next();
});

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
const register = asyncWrapper(async (req, res,next) => {
  const { username, password, profile, email } = req.body;

  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail) {
    return next(createCustomError("User already Exist",400))
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    const result = await user.save();
    return res.status(201).json({ msg: "User Registered Successfully" });
  }
});
/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example12",
  "password" : "admin123"
}
*/

const Login = asyncWrapper(async (req, res,next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(createCustomError("User not found",400))
  }

  const MatchPassword = await bcrypt.compare(password, user.password);
  if (!MatchPassword) {
    return next(createCustomError("incorrect email or password",400))
  }
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    ENV.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).send({
    message: "Login Successful...!",
    data: user.email,
    token,
  });
});

const getUser = asyncWrapper(async (req, res,next) => {
  const { id } = req.params;
  if (!id) {
    return next(createCustomError("invalid User",501))
  }
  const user = await UserModel.findOne({ _id:id });
  if (!user) {
    return next(createCustomError("couldn't find the user",501))
  }

  const { password, ...data } = Object.assign({}, user.toJSON());
  return res.status(200).send({
    status: "success",
    data: data,
  });
});

const getAllUser = asyncWrapper(async (req, res,next) => {
  const user = await UserModel.find();
  if(!user){
    return next(createCustomError("users not found",501))

  }

  if (!user) {
    return next(createCustomError("users not found",501))
  }
  return res.status(200).send({
    status: "success",
    data: user,
  });
});

const updateUser = asyncWrapper(async (req, res,next) => {
  const { userId } = req.user;
  const updatedUserData = req.body;
  const user = await UserModel.findByIdAndUpdate(
    { _id: userId },
    updatedUserData,
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(createCustomError("couldn't find the user",501))
  }
  res.status(201).json({ message: "User updated successfully", user });

});

export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ message: "Verify Successsfully!" });
  }
  return next(createCustomError("Invalid OTP",400))
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return next(createCustomError("Session expired!",440))
}

const resetPassword = asyncWrapper(async (req, res) => {
  if (!req.app.locals.resetSession) {
    return res.status(440).send({ error: "Session expired!" });
  }

  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(createCustomError("Username not found",404))
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.updateOne(
    { username: user.email },
    { password: hashedPassword }
  );

  req.app.locals.resetSession = false; // Reset session

  return res.status(201).send({ msg: "password  Updated...!" });
});

export {register, Login, updateUser, getAllUser, getUser, verifyUser, resetPassword };
