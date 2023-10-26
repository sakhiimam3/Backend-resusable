import jwt from "jsonwebtoken";
import { ENV } from "../config.js";

/** auth middleware */
export default async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token, "token");
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
    console.log(decodedToken, "decodeToken1122211");
    req.user = decodedToken;

    next()
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed!" });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
