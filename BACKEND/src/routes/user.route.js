import express from "express";  
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMyFriends, getRecomendedUsers } from "../controller/user_controller.js";

const router = express.Router();

//apply auth middleware to protect the routes
router.use(protectRoute);

router.get("/", getRecomendedUsers);
router.get("/friends", getMyFriends);

export default router;