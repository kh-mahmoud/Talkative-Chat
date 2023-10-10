import { prisma } from "../lib.js";
import express from "express"
import { verifytoken } from "../middleware/verify.js";
import {allMessages, sendMessage} from "../controllers/messageController.js"

const router=express.Router()


router.post("/",verifytoken,sendMessage)
router.get("/:chatId",verifytoken,allMessages)



export default router





