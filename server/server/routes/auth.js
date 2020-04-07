import express from "express";
import authControllers from "../controllers/auth";
import { auth } from "../middleware/auth";

const router = express.Router();

const { getAuth, getRegister, getLogin, getLogout } = authControllers;

router.get("/auth", auth, getAuth);
router.get("/logout", auth, getLogout);
router.post("/register", getRegister);
router.post("/login", getLogin);

export default router;
