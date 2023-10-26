import mongoose from "mongoose";
import { ENV } from "../config.js";

export const connectDataBase = () => {
  mongoose
    .connect(ENV.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongodb connected  with server ${data.connection.host}`);
    }).catch((err)=>console.log(`database connected error ${err}`))
};

