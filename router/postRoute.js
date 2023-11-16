import { Router } from "express";
const router = Router();
import Auth from "../middleware/auth.js";

/** import all controllers */
import * as controller from "../controllers/postController.js";

router.route("/create").post(Auth, controller.createPost);
router.route("/post").get(Auth, controller.getPost);

export default router;
