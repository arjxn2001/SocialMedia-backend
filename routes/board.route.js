import express from "express";
import { getUserBoards } from '../controller/board.controller.js';

const router = express.Router();

// Updated route path
router.get("/:userId", getUserBoards);

export default router;
