import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/route.js";
import PostRoutes from "./router/postRoute.js"
import { connectDataBase } from "../backend/database/conn.js";
import notFound from "./middleware/notfound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";

const app = express();

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about our stack

const port = 8080;

/** api routes */
app.use("/api/v1/", router);
app.use("/api/v1/", PostRoutes);



app.use(notFound)
app.use(errorHandlerMiddleware)


/** start server only when we have valid connection */
connectDataBase();

app.listen(port, () => {
  console.log(`Server connected to http://localhost:${port}`);
});
