import mongoose from "mongoose";

export const connectDataBase = () => {
  mongoose
    .connect("mongodb+srv://sakhidadskd:oQZ6jFQ34iO5LUm9@cluster0.mjlhsl1.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongodb connected  with server ${data.connection.host}`);
    }).catch((err)=>console.log(`database connected error ${err}`))
};

