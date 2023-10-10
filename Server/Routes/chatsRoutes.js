import express from "express"
import { accesschats, fetchChats, getchats,createGroupChat, renameGroupChat, addToGroup, removeFromGroup } from "../controllers/chatController.js"
import { verifytoken } from "../middleware/verify.js"


const router=express.Router()

router.post("/",verifytoken,accesschats)
router.get("/",verifytoken,fetchChats)
router.post("/group",verifytoken,createGroupChat)
router.put("/rename",verifytoken,renameGroupChat)
router.put("/groupadd",verifytoken,addToGroup)
router.put("/groupremove",verifytoken,removeFromGroup)


// router.get("/chats",verifytoken,getchats)

export default router