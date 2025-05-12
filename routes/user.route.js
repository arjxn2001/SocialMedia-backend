import express from "express"
import { getUser, registerUser ,loginUser,logoutUser, followUser} from "../controller/user.controller.js";
import { verifyToken } from "../controller/middlewares/verifyToken.js";


const router = express.Router();


router.get("/:userName", getUser)
router.post("/auth/register", registerUser)
router.post("/auth/login", loginUser)
router.post("/auth/logout", logoutUser)
router.post("/follow/:userName",verifyToken, followUser)




export default router;