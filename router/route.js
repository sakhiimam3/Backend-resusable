import { Router } from "express";
const router = Router();

/** import all controllers */
// import * as controller from '../controllers/appController.js';
// import { registerMail } from '../controllers/mailer.js'
// import Auth, { localVariables } from '../middleware/auth.js';



/** POST Methods */
router.route('/register').post(); // register user
router.route('/registerMail').post(); // send the email
router.route('/authenticate').post(); // authenticate user
router.route('/login').post(); // login in app

/** GET Methods */
router.route('/user/:username').get() // user with username
router.route('/generateOTP').get() // generate random OTP
router.route('/verifyOTP').get() // verify generated OTP
router.route('/createResetSession').get() // reset all the variables


/** PUT Methods */
router.route('/updateuser').put(); // is use to update the user profile
router.route('/resetPassword').put(); // use to reset password



export default router;