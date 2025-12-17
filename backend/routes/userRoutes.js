import express from "express";
import { getUserData, getUserRole } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserData);
router.get("/:user_id/role", getUserRole);

export default router;