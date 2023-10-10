import express from "express"
import { verifytoken } from "../middleware/verify.js";

const router=express.Router()



router.get('/protect',verifytoken,async(req, res) => {

    try {
        if(req.user)
        {
            return res.status(200).json({state:'authorized',user:req.user})
    
        }
        return res.status(401).json({state:'unauthorized'})
    } catch (error) {
        res.send("error")
    }
   


});

router.get('/block',verifytoken,async(req, res) => {

    return res.status(200).json({state:'authorized',user:req.user})
    

});


export default router