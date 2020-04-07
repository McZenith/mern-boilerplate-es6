import express from "express";
import indexControllers from "../controllers/index";

const router = express.Router();

const { getIndex } = indexControllers;

/* GET home page. */
router.get("/", getIndex);

export default router;
