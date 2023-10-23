
import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appControllers.js';
// import Auth, { localVariables } from '../middleware/auth.js';



/** POST Methods */
router.route('/register').post(controller.register); // register user
router.route('/registerMail').post(); // send the email
router.route('/authenticate').post(); // authenticate user
router.route('/login').post(controller.verifyUser,controller.Login); // login in app

/** GET Methods */
router.route('/user').get(controller.getAllUser) // user with username

router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get() // generate random OTP
router.route('/verifyOTP').get() // verify generated OTP
router.route('/createResetSession').get() // reset all the variables


/** PUT Methods */
router.route('/updateuser').put(); // is use to update the user profile
router.route('/resetPassword').put(); // use to reset password



export default router;