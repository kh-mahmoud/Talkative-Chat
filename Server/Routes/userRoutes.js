import { registerUser } from "../controllers/signupController.js";
import {loginUser} from "../controllers/loginController.js"
import { logout } from "../controllers/logoutController.js";
import {allusers} from "../controllers/userSearchController.js"
import { verifytoken } from "../middleware/verify.js"

import express from "express"

const router=express.Router()



router.post("/signup",registerUser)
router.post("/signin",loginUser)
router.get("/logout",logout)
router.get("/",verifytoken,allusers)



export default router