import { Router } from "express";

import { protectedRoute } from "../middlwares/auth.middleware.ts";
import { getAllUsers } from "../controllers/messages.controller.ts";

const router = Router();

router.get("/users", protectedRoute, getAllUsers);

export default router;
