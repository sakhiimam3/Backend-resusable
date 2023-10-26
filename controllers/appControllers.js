import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../config.js";
import otpGenerator from "otp-generator";

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { email } = req.method == "GET" ? req.query : req.body;
    // check the user existance
    let exist = await UserModel.findOne({ email });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

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
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "User already Exist" });
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
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example12",
  "password" : "admin123"
}
*/

export async function Login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const MatchPassword = await bcrypt.compare(password, user.password);
    if (!MatchPassword) {
      return res.status(400).json({ error: "incorrect email or password" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      ENV.JWT_SECRET,
      { expiresIn: "1m" }
    );

    return res.status(200).send({
      message: "Login Successful...!",
      data: user.email,
      token,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getUser(req, res) {
  try {
    console.log(req.params, "req.parms");
    const { username } = req.params;
    if (!username) {
      return res.status(501).json({ error: "invalid User" });
    }
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(501).json({ error: "couldn't find the user" });
    }

    const { password, ...data } = Object.assign({}, user.toJSON());
    return res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAllUser(req, res) {
  try {
    if (!username) {
      return res.status(501).json({ error: "invalid User" });
    }
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(501).json({ error: "couldn't find the user" });
    }

    return res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    const updatedUserData = req.body;

    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      updatedUserData,
      { new: true }
    );
    res.status(201).json({ message: "User updated successfully", user });
    if (!user) {
      return res.status(501).json({ error: "couldn't find the user" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

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
  return res.status(400).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { username: user.email },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false; // Reset session

    return res.status(201).send({ msg: "password  Updated...!" });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
}
